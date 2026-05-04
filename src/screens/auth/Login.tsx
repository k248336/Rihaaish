import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLoginController from '../../controllers/AuthControllers/Login';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import {
  getColors,
  images,
  screens,
  utility,
  navigate,
  icons,
  getAppStyles,
  // SocialLoginHelpers,
} from '../../utilities';
import {
  CustomText,
  IconButton,
  HeadingComp,
  CustomButton,
  CustomTextInput,
  CustomScrollView,
  AnimatedCheckbox,
  LoginErrorBottomModal,
} from '../../components';
import { useTheme } from '../../hooks';
import { useTranslation } from '../../utilities/translations';

const Login = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  const { values, functions, loginErrorModal, loginErrorT } =
    useLoginController();
  const socialBtn = [
    {
      id: 1,
      icon: images.googleLogo,
      onPress: () => {},
      title: t('continueWithGoogle'),
      // SocialLoginHelpers._googleLogin(functions.handleSocialLogin),
    },
    ...(utility.isPlatformIOS
      ? [
          {
            id: 2,
            icon: images.appleLogo,
            onPress: () => {},
            title: t('continueWithApple'),

            // SocialLoginHelpers._appleLogin(functions.handleSocialLogin),
          },
        ]
      : []),
  ];

  return (
    <View style={[appStyles.container, { backgroundColor: colors.background }]}>
      <CustomScrollView contentStyle={{ paddingBottom: 10 }}>
        <View style={dynamicStyles(colors).containerStyle}>
          <Image style={dynamicStyles(colors).logo} source={icons.logo} />
          <View style={appStyles.flexRow}>
            <CustomText
              fontSize={28}
              style={dynamicStyles(colors).title}
              color={colors.primary}
            >
              {t('login')}{' '}
            </CustomText>
            <CustomText
              fontSize={28}
              style={dynamicStyles(colors).subtitle}
              color={colors.primary}
            >
              {t('loginToContinue')}.
            </CustomText>
          </View>
          <CustomText fontSize={12} color={colors.greaytext}>
            {t('loginDescription')}.
          </CustomText>
        </View>

        <Formik
          initialValues={values.initialValues}
          // validationSchema={values.schema}
          onSubmit={functions.handleSignIn}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values: data,
            errors,
            touched,
          }) => (
            <View>
              <CustomTextInput
                icon={icons.email}
                autoCapitalize="none"
                placeholder={t('enterYourEmail')}
                returnKeyType="next"
                label={t('emailAddress')}
                value={data.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                errors={errors.email}
                focus={touched.email}
              />

              <CustomTextInput
                icon={icons.lock}
                passwordField
                placeholder={t('enterYourPassword')}
                label={t('password')}
                value={data.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                focus={touched.password}
                errors={errors.password}
              />

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // marginTop: heightPixel(28),
                }}
              >
                <AnimatedCheckbox
                  size={16}
                  checked={values.isRemember}
                  checkMarkColor={colors.white}
                  onValueChange={functions.toggleRemember}
                  labelContainerStyle={{ flex: 0 }}
                  checkboxContainerStyle={{ padding: 0, marginRight: 8 }}
                  labelStyle={{ color: colors.primary }}
                  label={
                    <CustomText
                      fontSize={12}
                      weight="medium"
                      color={colors.primary}
                    >
                      {t(`rememberMe`)}
                    </CustomText>
                  }
                />

                <CustomText
                  color={colors.purple1}
                  weight="medium"
                  style={dynamicStyles(colors).forgotPasswordStyle}
                  fontSize={12}
                  onPress={() => functions.navigateToScreen(screens.forgotPass)}
                >
                  {t('forgotPassword')}
                </CustomText>
              </View>

              <CustomButton
                gradient
                title={t('loginButton')}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
        <View style={{ flex: 1 }}>
          <View style={dynamicStyles(colors).separatorView}>
            <Image
              source={icons.line1}
              style={dynamicStyles(colors).lineseparator}
              tintColor={colors.borderGrey}
            />
            <CustomText
              color={colors.primary}
              weight="medium"
              style={{ marginHorizontal: 10 }}
            >
              {t('orContinueWith')}
            </CustomText>
            <Image
              style={dynamicStyles(colors).lineseparator}
              source={icons.line2}
              tintColor={colors.borderGrey}
            />
          </View>
          <View style={dynamicStyles(colors).row}>
            {socialBtn?.map(res => (
              <TouchableOpacity
                onPress={res.onPress}
                style={dynamicStyles(colors).socialbutton}
              >
                <Image
                  style={dynamicStyles(colors).socialicon}
                  source={res.icon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={[
            appStyles.flexRow,
            {
              alignSelf: 'center',
              marginTop: heightPixel(0),
              alignItems: 'center',
            },
          ]}
        >
          <CustomText
            style={dynamicStyles(colors).bottomText}
            color={colors.primary}
            weight="regular"
            fontSize={12}
          >
            {t('dontHaveAccount')}{' '}
          </CustomText>
          <View style={appStyles.flexRow}>
            <Image
              source={icons.sigarr}
              style={dynamicStyles(colors).arr}
              tintColor={colors.purple1}
            />
            <CustomText
              color={colors.purple1}
              fontSize={12}
              style={dynamicStyles(colors).bold}
              onPress={() => functions.navigateToScreen(screens.signup)}
            >
              {t('signup')}
            </CustomText>
          </View>
        </View>
      </CustomScrollView>

      <LoginErrorBottomModal
        visible={loginErrorModal.visible}
        mode={loginErrorModal.mode}
        headerTitle={
          loginErrorModal.mode === 'success'
            ? loginErrorT.successTitle
            : loginErrorT.alertTitle
        }
        message={loginErrorModal.message}
        showButton={loginErrorModal.mode !== 'success'}
        buttonTitle={
          loginErrorModal.mode === 'verify'
            ? loginErrorT.continueLabel
            : loginErrorT.ok
        }
        onBackdropPress={
          loginErrorModal.mode === 'success'
            ? () => {}
            : functions.hideLoginErrorModal
        }
        onButtonPress={functions.onLoginErrorButtonPress}
      />
    </View>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    logo: {
      width: widthPixel(44),
      height: heightPixel(39),
    },
    lineseparator: {
      width: widthPixel(120),
      resizeMode: 'contain',
      height: heightPixel(1),
    },
    socialicon: {
      height: heightPixel(28),
      width: widthPixel(28),
    },
    socialbutton: {
      height: heightPixel(50),
      width: widthPixel(50),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: heightPixel(50),
    },
    arr: { height: heightPixel(14), width: widthPixel(14) },
    bold: {
      fontWeight: '800',
      textDecorationLine: 'underline',
      textDecorationColor: colors.purple1,
    },
    title: { fontWeight: '800' },
    subtitle: {
      fontWeight: '300',
    },

    separatorView: {
      marginTop: heightPixel(20),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    separatorLine: {
      width: widthPixel(140),
      borderTopWidth: 0.5,
      borderTopColor: colors.subtitle,
    },
    socialBtnView: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    socialBtn: {
      backgroundColor: colors.black,
      marginTop: heightPixel(24),
    },
    googleBtn: {
      backgroundColor: colors.greishBg,
      marginTop: heightPixel(14),
    },
    fbBtn: {
      backgroundColor: colors.fbColor,
      marginTop: heightPixel(14),
    },
    bottomText: {
      textAlign: 'center',
      fontWeight: '300',
    },
    animatedCheckBoxContainer: {
      marginHorizontal: 5,
      marginTop: heightPixel(20),
    },
    containerStyle: {
      gap: heightPixel(5),
      alignItems: 'flex-start',
      marginTop: heightPixel(60),
      marginBottom: heightPixel(20),
    },
    forgotPasswordStyle: {
      alignSelf: 'flex-end',
      fontWeight: '600',
      textDecorationLine: 'underline',
      textDecorationColor: colors.purple1,
      marginVertical: 10,
    },
    iconStyle: {
      height: widthPixel(70),
      width: widthPixel(70),
      borderRadius: widthPixel(35),
      backgroundColor: colors.transparent,
      marginHorizontal: widthPixel(10),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: widthPixel(30),
      justifyContent: 'space-between',
      alignSelf: 'center',
      marginTop: heightPixel(21),
    },
  });

export default Login;
