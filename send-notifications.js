// send-notifications.js
const admin = require('firebase-admin');

// Ambil service account dari Secret GitHub (nanti diset di GitHub)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function sendReminders() {
  const now = new Date();
  // Format jam sekarang (HH:mm) sesuai timezone target, misal WIB (UTC+7)
  const currentTime = now.toLocaleTimeString('id-ID', { 
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' 
  });

  const db = admin.firestore();
  const snapshot = await db.collection('reminders')
    .where('reminderTime', '==', currentTime)
    .get();

  if (snapshot.empty) return;

  const messages = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    messages.push({
      token: data.fcmToken,
      notification: {
        title: `Reminder: ${data.habitName}`,
        body: 'Ayo selesaikan habit kamu sekarang!'
      }
    });
  });

  await admin.messaging().sendEach(messages);
  console.log(`Berhasil kirim ${messages.length} notifikasi.`);
}

sendReminders().catch(console.error);