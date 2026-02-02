import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { heightPixel, vh, widthPixel } from '../utilities/helpers';
import {
  hideLoader,
  logout,
  removeAccessToken,
  showLoader,
} from '../redux/slices';
import { useAppDispatch, useAppSelector, useTheme } from '../hooks';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import { LogoutModal } from './modals';
import {
  reset,
  icons,
  images,
  screens,
  navigate,
  closeDrawer,
  toggleDrawer,
  Shadows,
  getAppStyles,
} from '../utilities';

const CustomDrawerContent = (props: any) => {
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector(state => state.auth);

  const [selected, setSelected] = React.useState<number | null>(null);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const menuItemsLearner = [
    {
      id: 1,
      title: 'Profile',
      icon: icons.profiledrawer,
      screen: screens.profile,
    },
    {
      id: 2,
      title: 'Booking History',
      icon: icons.bookingdrawer,
      screen: screens.BookingHistory,
    },
    {
      id: 5,
      title: 'My Classes',
      icon: icons.liveclass,
      screen: screens.MyClasses,
    },
    {
      id: 6,
      title: 'Recorded Sessions',
      icon: icons.recorded,
      screen: screens.AllRecordingSession,
    },
    {
      id: 3,
      title: 'Payment Method',
      icon: icons.paymentmethod,
      screen: screens.paymentMethod,
    },
    {
      id: 4,
      title: 'Favourite',
      icon: icons.favourite,
      screen: screens.favourite,
    },

    {
      id: 7,
      title: 'Manage Subscription',
      icon: icons.managesubscription,
      screen: screens.ManageSubscription,
    },
    {
      id: 8,
      title: 'Privacy Policy',
      icon: icons.privacypolicy,
      screen: screens.privacyPolicy,
    },
    {
      id: 9,
      title: 'Terms & Conditions',
      icon: icons.termcondition,
      screen: screens.termsAndConditions,
    },
    { id: 10, title: 'Support', icon: icons.support, screen: screens.support },
    { id: 11, title: 'FAQ', icon: icons.faqs, screen: screens.faqs },
  ];
  const menuItemsInstructor = [
    {
      id: 1,
      title: 'Profile',
      icon: icons.profiledrawer,
      screen: screens.profile,
    },
    {
      id: 2,
      title: 'Booking History',
      icon: icons.bookingdrawer,
      screen: screens.BookingHistory,
    },
    {
      id: 3,
      title: 'Booking Request',
      icon: icons.bookingrequest,
      screen: screens.BookingRequest,
    },
    {
      id: 4,
      title: 'Payment Method',
      icon: icons.paymentmethod,
      screen: screens.paymentMethod,
    },
    {
      id: 5,
      title: 'My Payments',
      icon: icons.paymentmethod,
      screen: screens.MyPayments,
    },
    {
      id: 6,
      title: 'Privacy Policy',
      icon: icons.privacypolicy,
      screen: screens.privacyPolicy,
    },
    {
      id: 7,
      title: 'Terms & Conditions',
      icon: icons.termcondition,
      screen: screens.termsAndConditions,
    },
    { id: 8, title: 'Support', icon: icons.support, screen: screens.support },
    { id: 9, title: 'FAQ', icon: icons.faqs, screen: screens.faqs },
  ];

  const Maintab =
    userInfo.user_type == 'instructor' ? menuItemsInstructor : menuItemsLearner;

  const handleLogout = () => {
    closeDrawer();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(removeAccessToken(''));

    // dispatch(showLoader());
    setTimeout(() => {
      // dispatch(logout({}));
      reset(screens.mainStack);
      // dispatch(hideLoader());
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleMenuItemPress = (item: any) => {
    setSelected(item.id);
    closeDrawer();

    if (item.title == 'Profile') {
      navigate(screens.bottomTabs, { screen: 'ProfileScreen' });
    } else {
      navigate(item.screen);
    }
  };

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={dynamicStyles(colors).container}
      style={dynamicStyles(colors).drawerScrollView}
    >
      <View style={dynamicStyles(colors).header}>
        <TouchableOpacity onPress={closeDrawer} style={dynamicStyles(colors).closeButton}>
          <Image
            tintColor={colors.white}
            source={icons.backArrow}
            style={dynamicStyles(colors).closeIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles(colors).profileSection}>
        <Image source={icons.dummyAvatar1} style={dynamicStyles(colors).profileImage} />
        <View style={dynamicStyles(colors).profileInfo}>
          <CustomText fontSize={14} weight="semibold" color={colors.white}>
            Jaydon Bator
          </CustomText>
          <CustomText fontSize={13} weight="medium" color={colors.gray}>
            Learner
          </CustomText>
        </View>
      </View>

      <View style={dynamicStyles(colors).menuContainer}>
        {Maintab.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              dynamicStyles(colors).menuItem,
              // selected === item.id && styles.selectedMenuItem,
            ]}
            onPress={() => handleMenuItemPress(item)}
            activeOpacity={0.7}
          >
            <Image
              tintColor={colors.white}
              source={item.icon}
              style={dynamicStyles(colors).menuIcon}
            />
            <CustomText fontSize={14} weight="medium" color={colors.white}>
              {item.title}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={dynamicStyles(colors).logoutContainer}>
        <TouchableOpacity
          style={dynamicStyles(colors).logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Image source={icons.logout} style={dynamicStyles(colors).logoutIcon} />
          <CustomText fontSize={16} weight="semibold" color={colors.white}>
            Logout
          </CustomText>
        </TouchableOpacity>
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </DrawerContentScrollView>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    drawerScrollView: {
      backgroundColor: colors.black,
      flex: 1,
    },
    container: {
      flexGrow: 1,
      backgroundColor: colors.black,
      paddingTop: heightPixel(50),
      paddingHorizontal: widthPixel(20),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: heightPixel(10),
    },
    closeButton: {
      width: widthPixel(40),
      height: heightPixel(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      width: widthPixel(10),
      height: heightPixel(18),
      resizeMode: 'contain',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#000000',
      borderRadius: heightPixel(50),
      height: heightPixel(65),
      paddingHorizontal: widthPixel(10),
      marginBottom: heightPixel(10),
      borderWidth: 1,
      borderColor: colors.gray,
    },
    profileImage: {
      width: widthPixel(46),
      height: heightPixel(46),
      borderRadius: heightPixel(30),
      marginRight: widthPixel(15),
    },
    profileInfo: {
      flex: 1,
    },
    menuContainer: {
      flex: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: heightPixel(12),
      paddingHorizontal: widthPixel(10),
      marginBottom: heightPixel(5),
      borderRadius: heightPixel(10),
    },
    selectedMenuItem: {
      backgroundColor: colors.white,
    },
    menuIcon: {
      width: widthPixel(15),
      height: heightPixel(15),
      marginRight: widthPixel(15),
      resizeMode: 'contain',
    },
    logoutContainer: {
      // paddingBottom: heightPixel(30),
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      backgroundColor: '#EF6F6F',
      borderRadius: heightPixel(25),
      paddingVertical: heightPixel(15),
      paddingHorizontal: widthPixel(20),
    },
    logoutIcon: {
      width: widthPixel(16),
      height: heightPixel(16),
      marginRight: widthPixel(10),
      resizeMode: 'contain',
      transform: [{ rotate: '180deg' }],
    },
  });

export default CustomDrawerContent;
