import { Formik } from 'formik';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { filterNameKeyInput, getAppStyles, icons, screens } from '../../utilities';
import useSignUpController from '../../controllers/AuthControllers/SignUp';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import {
  CustomText,
  HeadingComp,
  CustomButton,
  PhoneTextInput,
  CustomTextInput,
  CustomScrollView,
  AnimatedCheckbox,
} from '../../components';
import { useTheme } from '../../hooks';
import { useTranslation } from '../../utilities/translations';

const Signup = () => {
  const { values, functions } = useSignUpController();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  return (
    <CustomScrollView
      showBackground={false}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <HeadingComp
        layout="first"
        title={t(`signUpTitle`)}
        titletxtWeight="bold"
        titleTxtSize={32}
        subTitleTxtSize={12}
        subTitleTxtColor={colors.greaytext}
        titleTxtColor={colors.primary}
        subTitle={t('signUpSubtitle')}
        containerStyle={dynamicStyles(colors).containerStyle}
      />

      <Formik
        initialValues={values.initialValues}
        validationSchema={values.schema}
        onSubmit={functions.handleSignUp}
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
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
                label={t('username')}
                placeholder={t('enterUsername')}
                onChangeText={handleChange('username')}
                value={data.username}
                onBlur={handleBlur('username')}
                errors={errors.username}
                focus={touched.username}
              />

              <View style={appStyles.flexRowBetween}>
                <View style={{ width: '48.5%' }}>
                  <CustomTextInput
                    label={t('firstName')}
                    maxLength={150}
                    returnKeyType="next"
                    placeholder={t('firstName')}
                    onChangeText={text =>
                      handleChange('firstname')(filterNameKeyInput(text))
                    }
                    value={data.firstname}
                    onBlur={handleBlur('firstname')}
                    errors={errors.firstname}
                    focus={touched.firstname}
                  />
                </View>

                <View style={{ width: '48.5%' }}>
                  <CustomTextInput
                    maxLength={150}
                    label={t('lastName')}
                    returnKeyType="next"
                    placeholder={t('lastName')}
                    onChangeText={text =>
                      handleChange('lastname')(filterNameKeyInput(text))
                    }
                    value={data.lastname}
                    onBlur={handleBlur('lastname')}
                    errors={errors.lastname}
                    focus={touched.lastname}
                  />
                </View>
              </View>

              <CustomTextInput
                returnKeyType="next"
                autoCapitalize="none"
                icon={icons.email}
                label={t('emailAddress')}
                keyboardType="email-address"
                placeholder={t('emailAddress')}
                onChangeText={handleChange('email')}
                value={data.email}
                errors={errors.email}
                focus={touched.email}
              />

              <PhoneTextInput
                placeholder={t('phoneNumber')}
                value={data.mobile_no}
                setValue={handleChange('mobile_no')}
                errors={errors.mobile_no}
                focus={touched.mobile_no}
              />

              <CustomTextInput
                passwordField
                icon={icons.lock}
                label={t('password')}
                placeholder={t('newPassword')}
                returnKeyType="next"
                onChangeText={handleChange('password')}
                value={data.password}
                errors={errors.password}
                focus={touched.password}
              />

              {/* <CustomTextInput
                passwordField
                icon={icons.lock}
                label={t('confirmPassword')}
                placeholder={t('confirmPassword')}
                value={data.confirm_password}
                onChangeText={handleChange('confirm_password')}
                errors={errors.confirm_password}
                focus={touched.confirm_password}
              /> */}

              <AnimatedCheckbox
                size={20}
                checked={values.check}
                checkMarkColor={colors.white}
                onValueChange={functions.toggle}
                checkedBackgroundColor={colors.red}
                checkboxContainerStyle={{ padding: 0, marginRight: 8 }}
                containerStyle={dynamicStyles(colors).animatedCheckBoxContainer}
                labelStyle={{ color: colors.primary }}
                label={
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <CustomText color={colors.primary} fontSize={12}>
                      {t('agreeTo')}
                    </CustomText>

                    <CustomText
                      fontSize={12}
                      weight="bold"
                      color={colors.purple1}
                    >
                      {' ' + t(`termsAndConditions`)}
                    </CustomText>
                    <CustomText color={colors.primary}>
                      {' ' + t('and')}
                    </CustomText>
                    <CustomText
                      fontSize={12}
                      weight="bold"
                      color={colors.purple1}
                    >
                      {' ' + t('privacyPolicy')}
                    </CustomText>
                  </View>
                }
              />

              <CustomButton
                gradient
                title={t('register')}
                onPress={() => handleSubmit()}
              />
            </View>
        )}
      </Formik>

      <View
        style={[
          appStyles.flexRow,
          {
            alignSelf: 'center',
            marginTop: heightPixel(10),
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
          {t('alreadyHaveAccount')}{' '}
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
            onPress={() => functions.navigateToScreen(screens.login)}
          >
            {t('login')}
          </CustomText>
        </View>
      </View>
    </CustomScrollView>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    bottomTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: heightPixel(25),
      marginBottom: heightPixel(32),
      marginHorizontal: widthPixel(16),
    },
    bold: {
      fontWeight: '800',
      textDecorationLine: 'underline',
    },
    arr: { height: heightPixel(14), width: widthPixel(14) },

    bottomText: {
      textAlign: 'center',
    },
    animatedCheckBoxContainer: {
      marginHorizontal: 5,
      marginTop: heightPixel(20),
    },
    btnStyle: { marginTop: heightPixel(28) },
    containerStyle: {
      gap: heightPixel(5),
      alignItems: 'flex-start',
      marginBottom: heightPixel(20),
    },
    headerContainerStyle: {
      alignItems: 'center',
      marginBottom: heightPixel(21),
    },
  });

export default Signup;
