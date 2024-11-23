// src/requestNotificationPermission.js
import { messaging } from './firebaseConfig';
import { getToken } from 'firebase/messaging';
import axios from 'axios';

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'BJe5C9hA_TfvIUrNYjPUYGqXp3487gMeZb3zPOZCfr7AMBo29g1uOcZNhMFxBWhCTJ_KSFIJUVAAbsQpV8Zp_df4' });
      if (token) {
        await saveFcmToken(userId, token);
      }
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
};

const saveFcmToken = async (userId, fcmToken) => {
  try {
    await axios.post('http://localhost:5000/api/save-fcm-token', { userId, fcmToken });
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};