import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {colors} from './constants';

export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // console.log('Authorization status:', enabled);

  return enabled;
}

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    // console.log('fcm token: ', token);
    AsyncStorage.setItem('fcm_token', token);
    return token;
  } catch (error) {
    console.log('getFcmToken error: ', error);
  }
};

export const subscribeToTopic = async (topic: any) => {
  await messaging()
    .subscribeToTopic(topic)
    .then(() => {
      console.log('Subscribed to topic!');
    })
    .catch(e => console.log('Error when subscribing to topic!'));
};

export const unSubscribeToTopic = async (topic: any) => {
  await messaging()
    .unsubscribeFromTopic(topic)
    .then(() => {
      console.log('Unsubscribed from the topic!');
    })
    .catch(e => console.log('Error when unsubscribing from the topic!'));
};

export const onDisplayNotification = async (data: any) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Cirgle Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    data: data?.data,
    title: data?.notification?.title,
    body: data?.notification?.body,
    android: {
      channelId,
      color: colors.primary,
      smallIcon: 'ic_notification_icon',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
};
