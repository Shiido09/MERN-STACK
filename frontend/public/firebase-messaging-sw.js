// Import Firebase libraries using importScripts
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBqZJ16H7zFsS6adQWZFW8wflM03ET7X1w",
  authDomain: "hab-appliances.firebaseapp.com",
  projectId: "hab-appliances",
  storageBucket: "hab-appliances.firebasestorage.app",
  messagingSenderId: "731540629953",
  appId: "1:731540629953:web:e1300a13660e6ccb28a740",
  measurementId: "G-P3MS2B71Y5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const { title, body } = payload.notification;
  const notificationOptions = {
    body,
    icon: '/favicon.ico', // Change to your notification icon if applicable
  };

  self.registration.showNotification(title, notificationOptions);
});
