// send-notifications.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Ambil service account dari Environment Variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize App
const app = initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Services
const db = getFirestore(app);
const messaging = getMessaging(app);

async function sendReminders() {
  const now = new Date();
  // Format jam sekarang (HH:mm) sesuai timezone target (WIB)
  const currentTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

  console.log(`Checking reminders for time: ${currentTime}`);

  const snapshot = await db
    .collection("reminders")
    .where("reminderTime", "==", currentTime)
    .get();

  if (snapshot.empty) {
    console.log("No reminders found for this time.");
    return;
  }

  const messages = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    // Validasi token agar tidak error jika kosong
    if (data.fcmToken) {
      messages.push({
        token: data.fcmToken,
        notification: {
          title: `Reminder: ${data.habitName}`,
          body: "Ayo selesaikan habit kamu sekarang!",
        },
      });
    }
  });

  if (messages.length > 0) {
    // sendEach adalah method baru untuk menggantikan sendAll
    const response = await messaging.sendEach(messages);
    console.log(`Berhasil kirim ${response.successCount} notifikasi.`);
    if (response.failureCount > 0) {
      console.log(`${response.failureCount} notifikasi gagal dikirim.`);
    }
  }
}

sendReminders().catch(console.error);
