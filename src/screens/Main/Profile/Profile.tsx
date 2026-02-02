import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CustomScrollView,
  CustomSwitch,
  CustomText,
  WelcomeHeader,
  AlertModal,
} from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  getAppStyles,
  getShadows,
  icons,
  navigate,
  screens,
} from '../../../utilities';
import {
  useAppDispatch,
  useAppSelector,
  useToggle,
  useTheme,
} from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import { toggleTheme } from '../../../redux/slices/theme';
import {
  logout,
  deleteAccount,
  removeAccessToken,
} from '../../../redux/slices/auth';
import { useState } from 'react';

export default function Profile() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(state => state.theme.isDarkMode);
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();
  console.log(t, 'ttttt');

  const Header = ({ insets }: { insets: any }) => {
    return (
      <WelcomeHeader
        containerStyle={{
          paddingTop: insets.top || heightPixel(5),
        }}
        name={t('profile')}
        hideProfile={true}
      />
    );
  };
  const personalinfo = [
    {
      id: 1,
      name: t('personalInfo'),
      image: icons.profiletab,
      onPress: screens.EditProfile,
    },
    {
      id: 2,
      name: t('listedProperties'),
      image: icons.listedproperty,
      onPress: screens.ListedProperty,
    },
    {
      id: 3,
      name: t('language'),
      image: icons.language,
      onPress: screens.LanguageScreen,
    },
    {
      id: 4,
      name: t('security'),
      image: icons.security,
      onPress: screens.Security,
    },
    { id: 5, name: t('notificationPreferences'), image: icons.notification },
    { id: 6, name: t('darkMode'), image: icons.moon },
  ];
  const supportinfo = [
    { id: 1, name: t('aboutUs'), image: icons.about, onPress: screens.AboutUs },
    {
      id: 2,
      name: t('contactUs'),
      image: icons.call,
      onPress: screens.ContactUs,
    },
    {
      id: 3,
      name: t('customerSupport'),
      image: icons.support,
      onPress: screens.SupportChat,
    },
    {
      id: 4,
      name: t('deleteAccount'),
      image: icons.deleteicon,
      onPress: () => setShowDeleteAccountModal(true),
    },
    {
      id: 5,
      name: t('logout'),
      image: icons.logout,
      onPress: () => setShowLogoutModal(true),
    },
  ];
  const [isPushNotiEnable, setIsPushNotiEnable, toggleNoti] = useToggle(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const onToggleNotification = () => {
    toggleNoti();
  };

  const onToggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const handleConfirmLogout = () => {
    // dispatch(removeAccessToken({}));
    setShowLogoutModal(false);
    navigate(screens.login);
  };

  const handleConfirmDeleteAccount = () => {
    // dispatch(deleteAccount());
    setShowDeleteAccountModal(false);
    navigate(screens.login);
  };

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <Header insets={insets} />;
      },
    });
  }, [insets, navigation]);
  return (
    <View style={appStyles.container}>
      <CustomScrollView>
        <View style={dynamicStyles(colors).header}>
          <View style={[dynamicStyles(colors).gap, appStyles.flexRow]}>
            <Image
              source={icons.dantal}
              style={dynamicStyles(colors).profileImage}
            />
            <View>
              <CustomText fontSize={16} weight="bold" color={colors.primary}>
                {t('name')}
              </CustomText>
              <CustomText
                fontSize={12}
                weight="regular"
                color={colors.greaytext}
              >
                {t('email')}
              </CustomText>
            </View>
          </View>
          <Image
            source={icons.rightarrow}
            style={dynamicStyles(colors).rightarrow}
          />
        </View>
        <View style={dynamicStyles(colors).personalinfocard}>
          {personalinfo.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                item.onPress && navigate(item.onPress);
              }}
              activeOpacity={0.8}
              style={dynamicStyles(colors).innercard}
            >
              <View
                style={[appStyles.flexRowBetween, dynamicStyles(colors).gap]}
              >
                <View style={dynamicStyles(colors).imageview}>
                  <Image
                    source={item.image}
                    style={dynamicStyles(colors).image}
                  />
                </View>
                <CustomText fontSize={14} color={colors.primary}>
                  {item.name}
                </CustomText>
              </View>
              {item?.id === 5 ? (
                <CustomSwitch
                  switchVal={isPushNotiEnable}
                  setSwitchVal={onToggleNotification}
                />
              ) : item?.id === 6 ? (
                <CustomSwitch
                  switchVal={isDarkMode}
                  setSwitchVal={onToggleDarkMode}
                />
              ) : (
                <Image
                  source={icons.rightarrow}
                  style={dynamicStyles(colors).rightarrow}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={dynamicStyles(colors).personalinfocard}>
          {supportinfo.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                if (item.id === 4) {
                  setShowDeleteAccountModal(true);
                } else if (item.id === 5) {
                  setShowLogoutModal(true);
                } else {
                  item.onPress && navigate(item.onPress);
                }
              }}
              style={dynamicStyles(colors).innercard}
              activeOpacity={0.8}
            >
              <View
                style={[appStyles.flexRowBetween, dynamicStyles(colors).gap]}
              >
                <View style={dynamicStyles(colors).imageview}>
                  <Image
                    source={item.image}
                    style={dynamicStyles(colors).image}
                  />
                </View>
                <CustomText fontSize={14} color={colors.primary}>
                  {item.name}
                </CustomText>
              </View>
              <Image
                source={icons.rightarrow}
                style={dynamicStyles(colors).rightarrow}
              />
            </TouchableOpacity>
          ))}
        </View>
      </CustomScrollView>
      <AlertModal
        title={t('deleteAccountTitle')}
        showCrossIcon
        backgroundcolor={colors.redOpacity}
        subText={t('deleteAccountDes')}
        logoImage={icons.deleteicon}
        visible={showDeleteAccountModal}
        confirmBtnTitle={t('Yes')}
        onConfirm={handleConfirmDeleteAccount}
        setVisible={() => {
          setShowDeleteAccountModal(false);
        }}
      />

      <AlertModal
        title={t('logoutTitle')}
        showCrossIcon
        backgroundcolor={colors.redOpacity}
        subText={t('logoutDes')}
        logoImage={icons.logout}
        visible={showLogoutModal}
        confirmBtnTitle={t('Yes')}
        onConfirm={handleConfirmLogout}
        setVisible={() => {
          setShowLogoutModal(false);
        }}
      />
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      height: heightPixel(76),
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      paddingHorizontal: widthPixel(10),
      alignItems: 'center',
      marginTop: heightPixel(20),
      ...getShadows(false).shadow3,
      borderRadius: heightPixel(20),
      flexDirection: 'row',
    },
    imageview: {
      height: heightPixel(40),
      width: widthPixel(40),
      borderRadius: heightPixel(50),
      backgroundColor: colors.imageview,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      height: heightPixel(16),
      width: widthPixel(16),
      tintColor: colors.greaytext,
    },
    personalinfocard: {
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      paddingHorizontal: widthPixel(10),
      marginTop: heightPixel(10),
      ...getShadows(false).shadow3,
      borderRadius: heightPixel(20),
    },
    innercard: {
      marginTop: heightPixel(10),
      padding: 4,
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      gap: 10,
      paddingBottom: 10,
    },
    gap: {
      gap: widthPixel(10),
    },
    profileImage: {
      height: heightPixel(52),
      width: widthPixel(52),
      borderRadius: heightPixel(50),
    },
    rightarrow: {
      height: heightPixel(16),
      width: widthPixel(16),
      tintColor: colors.greaytext,
    },
  });
