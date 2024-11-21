// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqZJ16H7zFsS6adQWZFW8wflM03ET7X1w",
  authDomain: "hab-appliances.firebaseapp.com",
  projectId: "hab-appliances",
  storageBucket: "hab-appliances.firebasestorage.app",
  messagingSenderId: "731540629953",
  appId: "1:731540629953:web:e1300a13660e6ccb28a740",
  measurementId: "G-P3MS2B71Y5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();