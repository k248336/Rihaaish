import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerLeftTitle } from './NavigationOptions';
import { getColors, screens } from '../utilities';
import { BackButton } from '../components';
import { useAppSelector, useTheme } from '../hooks';
import BottomTabs from './BottomTabs';
import {
  AboutUs,
  AddProperty,
  ContactUs,
  Language,
  ListedProperty,
  NewProjects,
  OnBoarding,
  PropertyDetail,
  Security,
  Splash,
  SupportChat,
  Login,
  Signup,
  ResetPassword,
  ForgotPassword,
  OtpVerification,
  CompleteProfile,
  EditProfile,
  Notification,
  Prelogin,
} from '../screens';
import { useTranslation } from '../utilities/translations';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { accessToken, userInfo } = useAppSelector(state => state?.auth);
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const colors = getColors(isDarkMode);

  const { hasSeenOnboarding } = useAppSelector(state => state?.onboarding);

  let initialState = '';

  const screenOptions = {
    animation: 'slide_from_right',
    navigationBarHidden: true,
    statusBarStyle: isDarkMode ? 'light' : 'dark',
    statusBarTranslucent: false,
    statusBarBackgroundColor: colors.white,
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.white,
      shadowColor: colors.transparent,
    },
    headerLeft: () => <BackButton />,
  };

  // if (accessToken) {
  //   if (userInfo?.user_type !== '') {
  //     initialState = screens.bottomTabs;
  //   } else {
  //     initialState = screens.selectRole;
  //   }
  // } else if (hasSeenOnboarding) {
  //   initialState = screens.selectRole;
  // } else {
  //   // initialState = screens.Prelogin;
  //   initialState = screens.onBoarding;
  // }

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName={'Splash'}>
      <Stack.Screen
        name={screens.Splash}
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.onBoarding}
        component={OnBoarding}
        options={{ headerShown: false, statusBarStyle: 'light' }}
      />
      <Stack.Screen
        name={screens.login}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Prelogin}
        component={Prelogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.signup}
        component={Signup}
        options={{ ...headerLeftTitle('') }}
      />
      <Stack.Screen
        name={screens.forgotPass}
        component={ForgotPassword}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name={screens.otpVerification}
        component={OtpVerification}
        options={{ headerTitle: '' }}
      />
      <Stack.Screen
        name={screens.resetPass}
        component={ResetPassword}
        options={{
          headerTitle: 'Reset Password',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.CompleteProfile}
        component={CompleteProfile}
        options={{ headerTitle: 'Profile Setup' }}
      />
      <Stack.Screen
        name={screens.bottomTabs}
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.NewProjects}
        component={NewProjects}
        options={{
          headerTitle: 'New Projects',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.EditProfile}
        component={EditProfile}
        options={{
          headerTitle: 'Edit Profile',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.ListedProperty}
        component={ListedProperty}
        options={{
          headerTitle: 'Listed Property',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.ContactUs}
        component={ContactUs}
        options={{
          headerTitle: 'Support',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.SupportChat}
        component={SupportChat}
        // options={{ headerTitle: `Appointment Details` }}
      />
      <Stack.Screen
        name={screens.AboutUs}
        component={AboutUs}
        options={{
          headerTitle: 'About Us',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 15,
          },
        }}
      />
      <Stack.Screen
        name={screens.LanguageScreen}
        component={Language}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
        }}
      />
      <Stack.Screen
        name={screens.Security}
        component={Security}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: isDarkMode
              ? colors.background
              : colors.transparent,
          },
        }}
      />
      <Stack.Screen
        name={screens.notifications}
        component={Notification}
        options={{
          headerTitle: 'Notifications',
          headerStyle: {
            backgroundColor: colors.transparent,
          },
        }}
      />
      <Stack.Screen
        name={screens.PropertyDetail}
        component={PropertyDetail}
        options={{}}
      />

      <Stack.Screen
        name={screens.AddProperty}
        options={{
          headerShown: true,
        }}
        component={AddProperty}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
