import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
// import {
//   check,
//   openSettings,
//   PERMISSIONS,
//   request,
//   RESULTS,
// } from 'react-native-permissions';
import { initialWindowMetrics } from 'react-native-safe-area-context';
// import Toast from 'react-native-toast-message';


const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

export const vh = (Dimensions.get('window').height - STATUSBAR_HEIGHT) * 0.01;
export const vw = Dimensions.get('window').width * 0.01;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const heightBaseScale: number = SCREEN_HEIGHT / 812;

export const BOTTOMBAR_HEIGHT =
  ((Platform.OS === 'ios' ? initialWindowMetrics?.insets.bottom : 0) || 0) +
  (SCREEN_HEIGHT - STATUSBAR_HEIGHT) * 0.01 * 8;


export const width = vw * 80

const widthBaseScale: number = SCREEN_WIDTH / 375;

function normalize(size: number, based: 'width' | 'height' = 'width'): number {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const heightPixel = (size: number): number => {
  return normalize(size, 'height');
};

export const widthPixel = (size: number): number => {
  return normalize(size, 'width');
};

export const font = (size: number): number => {
  return heightPixel(size);
};

export const appShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

// export const requestNotificationPermission = async () => {
//   if (Platform.OS !== 'android') return;

//   try {
//     // Check if we're on Android 13 or higher (API level 33+)
//     const isAndroid13OrHigher = Platform.Version >= 33;

//     const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

//     // Ensure permission is defined for Android 13+
//     if (!permission) {
//       Toast.show({
//         text1: 'Error',
//         text2: 'Permission is not defined!',
//         type: 'error',
//       });
//       throw new Error('Permission is not defined!');
//     }

//     // If Android version is below 13, this permission is not needed
//     if (!isAndroid13OrHigher) {
//       console.log('No need to request permission on this Android version');
//       return;
//     }

//     // If on Android 13 or higher, check the permission status
//     const permissionStatus = await checkPermission(permission);

//     console.log('Notification Permission Status:', permissionStatus);

//     return permissionStatus;  // Either GRANTED, DENIED, or BLOCKED

//   } catch (error) {
//     console.log('Error requesting notification permission:', error);
//     Toast.show({
//       text1: 'Error',
//       text2: error.message || 'Unknown error',
//       type: 'error',
//     });
//     throw new Error(error);
//   }
// };

// Handle permission checking
// const checkPermission = async (permission) => {
//   const result = await check(permission);

//   return new Promise(async (resolve, reject) => {
//     console.log(`Checking permission result: ${result}`);

//     switch (result) {
//       case RESULTS.UNAVAILABLE:
//         console.log('Permission is unavailable');
//         return reject(RESULTS.UNAVAILABLE);

//       case RESULTS.DENIED:
//         console.log('Permission is denied');
//         try {
//           const requestResult = await getPermission(permission);
//           return resolve(requestResult);
//         } catch (error) {
//           return reject(error);
//         }

//       case RESULTS.GRANTED:
//         console.log('Permission is granted');
//         return resolve(RESULTS.GRANTED);

//       case RESULTS.BLOCKED:
//         console.log('Permission is blocked');
//         setTimeout(() => {
//           openSettings();  // This opens the app settings to manually enable permission
//         }, 2000);
//         return reject(RESULTS.BLOCKED);
//     }
//   });
// };

// Handle permission requesting
// const getPermission = async (permission) => {
//   const result = await request(permission);

//   return new Promise(async (resolve, reject) => {
//     console.log(`Requesting permission result: ${result}`);

//     switch (result) {
//       case RESULTS.UNAVAILABLE:
//         console.log('Permission request failed, unavailable');
//         return reject(RESULTS.UNAVAILABLE);

//       case RESULTS.DENIED:
//         console.log('Permission denied by user');
//         return reject(RESULTS.DENIED);

//       case RESULTS.GRANTED:
//         console.log('Permission granted');
//         return resolve(RESULTS.GRANTED);

//       case RESULTS.BLOCKED:
//         console.log('Permission blocked by user');
//         return reject(RESULTS.BLOCKED);
//     }
//   });
// };