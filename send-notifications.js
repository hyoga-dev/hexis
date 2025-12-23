// send-notifications.js
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

  // 1. Calculate the Time Window (Current Time vs 15 Minutes Ago)
  const options = {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const timeStringNow = now
    .toLocaleTimeString("id-ID", options)
    .replace(".", ":");

  const pastDate = new Date(now.getTime() - 15 * 60000); // 15 mins ago
  const timeStringPast = pastDate
    .toLocaleTimeString("id-ID", options)
    .replace(".", ":");

  const todayString = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });

  console.log(`Checking Window: ${timeStringPast} to ${timeStringNow}`);

  // 2. Query: Find habits within this time window using "pengingat"
  const habitsRef = db.collectionGroup("habits");
  const snapshot = await habitsRef
    .where("pengingat", ">=", timeStringPast) // CHANGED HERE
    .where("pengingat", "<=", timeStringNow) // CHANGED HERE
    .get();

  if (snapshot.empty) {
    console.log("No reminders found in this time window.");
    return;
  }

  const habitsByToken = {};
  const batch = db.batch();
  let updatesCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // 3. SPAM CHECK: Did we already remind them today?
    if (data.lastRemindedDate === todayString) {
      continue;
    }

    let token = data.fcmToken;
    // Fetch token from parent User if missing
    if (!token) {
      try {
        const userDoc = await doc.ref.parent.parent.get();
        if (userDoc.exists) token = userDoc.data().fcmToken;
      } catch (err) {
        console.error(err);
      }
    }

    if (token) {
      if (!habitsByToken[token]) habitsByToken[token] = [];
      habitsByToken[token].push(
        data.title || data.habitName || "Unnamed Habit"
      );

      // 4. Mark as "Sent" in Database
      batch.update(doc.ref, { lastRemindedDate: todayString });
      updatesCount++;
    }
  }

  // 5. Send Notifications (Grouped)
  const messages = [];
  for (const [token, titles] of Object.entries(habitsByToken)) {
    const bodyText =
      titles.length === 1
        ? `Time to complete: ${titles[0]}`
        : `Time to complete: ${titles.length} habits including ${titles[0]}`;

    messages.push({
      token: token,
      notification: {
        title: "Hexis Reminder",
        body: bodyText,
      },
      webpush: { fcmOptions: { link: "https://hexis-ca21c.web.app" } },
    });
  }

  if (messages.length > 0) {
    console.log(`Sending ${messages.length} notifications...`);
    await messaging.sendEach(messages);
    await batch.commit();
    console.log(`Successfully updated ${updatesCount} habits as reminded.`);
  } else {
    console.log("Habits found, but all were already reminded today.");
  }
}

sendReminders().catch(console.error);
