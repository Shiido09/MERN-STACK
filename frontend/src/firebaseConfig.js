// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyBqZJ16H7zFsS6adQWZFW8wflM03ET7X1w",
  authDomain: "hab-appliances.firebaseapp.com",
  projectId: "hab-appliances",
  storageBucket: "hab-appliances.firebasestorage.app",
  messagingSenderId: "731540629953",
  appId: "1:731540629953:web:e1300a13660e6ccb28a740",
  measurementId: "G-P3MS2B71Y5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);

// Handle incoming messages in the foreground
onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);
  toast.info(`${payload.notification.title}: ${payload.notification.body}`);
});
