import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useMemo } from 'react';
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
  strings,
  utility,
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
  clearSession,
} from '../../../redux/slices/auth';
import { showLoader, hideLoader } from '../../../redux/slices';
import { useState } from 'react';

export default function Profile() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(state => state.theme.isDarkMode);
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();
  const { userInfo } = useAppSelector(s => s.auth);

  const displayName = useMemo(() => {
    const f = userInfo.firstname?.trim();
    const l = userInfo.lastname?.trim();
    if (f || l) {
      return [f, l].filter(Boolean).join(' ');
    }
    if (userInfo.email) {
      return userInfo.email.split('@')[0] || userInfo.email;
    }
    return '—';
  }, [userInfo.firstname, userInfo.lastname, userInfo.email]);

  const avatarSource = useMemo(() => {
    const url = userInfo.image_url?.trim();
    if (
      url &&
      (url.startsWith('http://') || url.startsWith('https://'))
    ) {
      return { uri: url };
    }
    return icons.dantal;
  }, [userInfo.image_url]);

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
    {
      id: 5,
      name: t('changePassword'),
      image: icons.key,
      onPress: screens.changePass,
    },
    { id: 6, name: t('notificationPreferences'), image: icons.notification },
    { id: 7, name: t('darkMode'), image: icons.moon },
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

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    dispatch(showLoader());
    try {
      await dispatch(logout()).unwrap();
    } catch {
      dispatch(clearSession());
    } finally {
      dispatch(hideLoader());
      navigate(screens.login);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    dispatch(showLoader());
    try {
      await dispatch(deleteAccount()).unwrap();
      utility.showAlertMessage('success', strings.accountDeleteSuccess);
      navigate(screens.login);
    } catch (err: any) {
      const msg =
        err?.message ??
        (typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: string }).message)
          : strings.somethingWentWrong);
      utility.showAlertMessage('danger', String(msg));
    } finally {
      dispatch(hideLoader());
    }
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
              source={avatarSource}
              style={dynamicStyles(colors).profileImage}
            />
            <View style={{ flex: 1 }}>
              <CustomText fontSize={16} weight="bold" color={colors.primary}>
                {displayName}
              </CustomText>
              <CustomText
                fontSize={12}
                weight="regular"
                color={colors.greaytext}
              >
                {userInfo.email?.trim() || '—'}
              </CustomText>
              {!!userInfo.mobile_no?.trim() && (
                <CustomText
                  fontSize={12}
                  weight="regular"
                  color={colors.greaytext}
                >
                  {userInfo.mobile_no}
                </CustomText>
              )}
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
              {item?.id === 6 ? (
                <CustomSwitch
                  switchVal={isPushNotiEnable}
                  setSwitchVal={onToggleNotification}
                />
              ) : item?.id === 7 ? (
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
                } else if (typeof item.onPress === 'string') {
                  navigate(item.onPress);
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
        checkboxlabel=""
        check={false}
        setCheck={() => {}}
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
        checkboxlabel=""
        check={false}
        setCheck={() => {}}
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
