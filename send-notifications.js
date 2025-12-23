// send-notifications.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// 1. Initialize Firebase Admin using Environment Variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

async function sendReminders() {
  const now = new Date();

  // 2. Generate Time String (e.g., "23:00")
  const options = {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const timeString = now.toLocaleTimeString("id-ID", options);

  // Handle both "23.00" (Indonesian locale) and "23:00" (Standard ISO)
  // This ensures we catch the reminder regardless of how it was saved.
  const timeWithColon = timeString.replace(".", ":");
  const timeWithDot = timeString.replace(":", ".");

  console.log(
    `Checking reminders for time: ${timeWithColon} OR ${timeWithDot}`
  );

  // 3. Search for habits using Collection Group Query
  // Note: This requires the "Collection Group Index" on 'habits' for field 'reminderTime'
  const habitsRef = db.collectionGroup("habits");

  // Run two queries in parallel for both time formats
  const [snapshotColon, snapshotDot] = await Promise.all([
    habitsRef.where("reminderTime", "==", timeWithColon).get(),
    habitsRef.where("reminderTime", "==", timeWithDot).get(),
  ]);

  // Combine results
  const allDocs = [...snapshotColon.docs, ...snapshotDot.docs];

  if (allDocs.length === 0) {
    console.log("No reminders found for this time.");
    return;
  }

  // 4. Group Habits by User Token (To prevent spamming the user)
  const habitsByToken = {};

  for (const doc of allDocs) {
    const data = doc.data();
    let token = data.fcmToken;

    // If token is missing in the habit, fetch it from the parent User document
    if (!token) {
      try {
        const userDoc = await doc.ref.parent.parent.get();
        if (userDoc.exists) {
          token = userDoc.data().fcmToken;
        }
      } catch (err) {
        console.error(`Could not fetch parent user for habit ${doc.id}`);
      }
    }

    if (token) {
      if (!habitsByToken[token]) {
        habitsByToken[token] = [];
      }
      // Add this habit's title to the user's list
      habitsByToken[token].push(
        data.title || data.habitName || "Unnamed Habit"
      );
    }
  }

  const messages = [];

  // 5. Create ONE summary message per user
  for (const [token, titles] of Object.entries(habitsByToken)) {
    let bodyText = "";

    // Logic to format the list nicely
    if (titles.length === 1) {
      bodyText = `Time to complete: ${titles[0]}`;
    } else if (titles.length === 2) {
      bodyText = `Time to complete: ${titles[0]} and ${titles[1]}`;
    } else if (titles.length === 3) {
      bodyText = `Time to complete: ${titles[0]}, ${titles[1]}, and ${titles[2]}`;
    } else {
      bodyText = `Time to complete: ${titles[0]}, ${titles[1]} and ${
        titles.length - 2
      } others.`;
    }

    messages.push({
      token: token,
      notification: {
        title: "Hexis Reminder",
        body: bodyText,
      },
      // PWA Specific Config: Clicking notification opens the app
      webpush: {
        fcmOptions: {
          link: "https://hexis-ca21c.web.app",
        },
      },
    });
  }

  // 6. Send the Batch
  if (messages.length > 0) {
    console.log(`Sending ${messages.length} notifications...`);
    const response = await messaging.sendEach(messages);
    console.log(
      `Success: ${response.successCount}, Failed: ${response.failureCount}`
    );

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Error sending to device ${idx}:`, resp.error);
        }
      });
    }
  } else {
    console.log("Found habits, but no valid tokens were found.");
  }
}

sendReminders().catch(console.error);
