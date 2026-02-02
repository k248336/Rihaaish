import React, { useEffect } from 'react';
// import SplashScreen from 'react-native-splash-screen';
import { Host } from 'react-native-portalize';
import SplashScreen from 'react-native-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomDrawerContent, LoaderModal } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { hideLoader } from '../redux/slices';
import { screens } from '../utilities';
import MainStack from './MainStack';

const Drawer = createDrawerNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
};

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  const dispatch = useAppDispatch();

  const { accessToken, userInfo } = useAppSelector(state => state?.auth);
  const { isVisible } = useAppSelector(state => state?.loader);
  // console.log('accessToken: ', accessToken);

  useEffect(() => {
    dispatch(hideLoader());

    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);

  // useEffect(() => {
  //   if (accessToken && userInfo?.id) {

  //   }
  // }, [accessToken]);

  // useEffect(() => {
  //   return notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         // console.log('User dismissed notification: ', detail.notification);
  //         notifee.cancelNotification(detail.notification.id);
  //         break;
  //       case EventType.PRESS:
  //         // console.log('User pressed notification: ', detail);
  //         onPressNotification(detail.notification.data);
  //         break;
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   // Check notification on foreground
  //   messaging().onMessage(async rm => {
  //     console.log('notification received in foreground: ', rm);

  //     const currentRoute = navigatorRef?.current?.getCurrentRoute().name;

  //     if (currentRoute != screens.chat) {
  //       onDisplayNotification(rm);
  //     }
  //     // setTimeout(() => {
  //     //   notifee.cancelDisplayedNotifications();
  //     // }, 6000);
  //   });

  //   // when app opened from notification press
  //   messaging().onNotificationOpenedApp(rm => {
  //     // console.log('onNotificationOpenedApp: ', rm);
  //     onPressNotification(rm.data);
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(rm => {
  //       // console.log('getInitialNotification res: ', rm);
  //       if (rm !== null) {
  //         onPressNotification(rm.data);
  //       }
  //     });
  // }, []);

  // const onPressNotification = noti => {
  //   console.log('onPress noti: ', noti);

  //   switch (noti.type) {
  //     case 'message':
  //       // navigate(screens.chat);
  //       break;
  //     default:
  //       break;
  //   }

  //   // if (noti?.type != 'message') {
  //   //   dispatch(getBadgeCount(''));
  //   //   dispatch(getNotifications(''));
  //   // }

  //   // notifee.cancelAllNotifications();
  // };

  return (
    <>
      <Host>
        <Drawer.Navigator
          screenOptions={screenOptions}
          drawerContent={props => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name={screens.mainStack}
            component={MainStack}
            options={{ headerShown: false, swipeEnabled: false }}
          />
        </Drawer.Navigator>
      </Host>

      <LoaderModal visible={isVisible} />
    </>
  );
}
