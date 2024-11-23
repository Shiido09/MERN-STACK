import { messaging } from './firebaseConfig';
import { getToken, deleteToken } from 'firebase/messaging';
import axios from 'axios';

export const requestNotificationPermission = async (userId) => {
  try {
    // Ensure notification permissions are granted
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted.');
    }

    // Ensure Service Worker is ready
    const registration = await navigator.serviceWorker.ready;

    // Delete any existing token to force a fresh one
    await deleteToken(messaging);

    // Get a new FCM token
    const token = await getToken(messaging, {
      vapidKey: 'BJe5C9hA_TfvlUrNYjPUYGqXp3487gMeZb3zPOZCfr7AMBo29g1uOcZNhMFxBWhCTJ_KSFIJUVAbsQpV8Zp_df4', // Your VAPID key
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      throw new Error('Failed to generate a new FCM token.');
    }

    console.log('Generated new FCM token:', token);
    await saveFcmToken(userId, token);
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
};

const saveFcmToken = async (userId, fcmToken) => {
  try {
    await axios.post('http://localhost:5000/api/auth/save-fcm-token', { userId, fcmToken });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    throw error;
  }
};