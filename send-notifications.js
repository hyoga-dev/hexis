import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

async function sendReminders() {
  const now = new Date();

  // FORCE separator to be '.' or ':' based on how you saved it in DB
  // Indonesian locale often uses '.' (22.51), but HTML inputs usually save ':' (22:51)
  // Let's generate BOTH to be safe.
  const options = {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const timeString = now.toLocaleTimeString("id-ID", options);

  // Normalizing: Replace dot with colon just in case your DB uses "22:51"
  const timeWithColon = timeString.replace(".", ":");
  const timeWithDot = timeString.replace(":", ".");

  console.log(
    `Checking reminders for time: ${timeWithColon} OR ${timeWithDot}`
  );

  // USE COLLECTION GROUP to search all "habits" collections inside any user
  const habitsRef = db.collectionGroup("habits");

  // Check for both time formats to be safe
  const snapshotColon = await habitsRef
    .where("reminderTime", "==", timeWithColon)
    .get();
  const snapshotDot = await habitsRef
    .where("reminderTime", "==", timeWithDot)
    .get();

  const allDocs = [...snapshotColon.docs, ...snapshotDot.docs];

  if (allDocs.length === 0) {
    console.log("No reminders found for this time.");
    return;
  }

  const messages = [];

  for (const doc of allDocs) {
    const data = doc.data();

    // IMPORTANT: If fcmToken is not in the habit, we must fetch it from the parent User
    let token = data.fcmToken;

    if (!token) {
      // Logic: Go up to the parent "users" document
      const userDoc = await doc.ref.parent.parent.get();
      if (userDoc.exists) {
        token = userDoc.data().fcmToken;
      }
    }

    if (token) {
      messages.push({
        token: token,
        notification: {
          title: `Reminder: ${data.title || data.habitName || "Habit"}`,
          body: "Time to complete your habit!",
        },
        // Adding webpush config specifically for PWA
        webpush: {
          fcmOptions: {
            link: "https://hexis-ca21c.web.app/", // Change this to your actual URL
          },
        },
      });
    } else {
      console.log(`Habit ${doc.id} has no token.`);
    }
  }

  if (messages.length > 0) {
    const response = await messaging.sendEach(messages);
    console.log(
      `Success: ${response.successCount}, Failed: ${response.failureCount}`
    );
  } else {
    console.log("Found habits, but no valid tokens to send to.");
  }
}

sendReminders().catch(console.error);
