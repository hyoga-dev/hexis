// public/firebase-messaging-sw.js

// Menggunakan versi compat (SDK v9) agar lebih stabil di dalam service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Gunakan config yang sama dengan yang ada di firebase.js kamu
const firebaseConfig = {
  apiKey: "AIzaSyBYFL2_tGxMTkOgs2326-1-aLq26UBl-2s",
  authDomain: "hexis-ca21c.firebaseapp.com",
  projectId: "hexis-ca21c",
  storageBucket: "hexis-ca21c.firebasestorage.app",
  messagingSenderId: "671529564556",
  appId: "1:671529564556:web:c39de4386a6ed09d54fea9",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Menangani notifikasi saat aplikasi berada di background (tab tertutup/HP terkunci)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png', // Ganti dengan path icon PWA kamu
    badge: '/pwa-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});