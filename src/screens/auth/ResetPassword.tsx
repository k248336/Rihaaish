import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import {
  getAppStyles,
  icons,
  images,
  reset,
  screens,
  strings,
  utility,
} from '../../utilities';
import { hideLoader, resetPassword, showLoader } from '../../redux/slices';
import { useAppDispatch, useTheme } from '../../hooks';
import {
  CustomText,
  CustomButton,
  CustomTextInput,
  CustomScrollView,
} from '../../components';
import { useTranslation } from '../../utilities/translations';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const initialValues = {
  password: '',
  confirmPassword: '',
};

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    // dispatch(showLoader());

    var data = {
      new_password: values.password,
      confirm_password: values.confirmPassword,
    };

    // dispatch(resetPassword(data))
    // .unwrap()
    // .then(res => {
    // console.log('resetPassword res: ', res);

    // dispatch(hideLoader());
    utility.showAlertMessage('success', strings.resetPassword);
    reset(screens.login);
    // })
    // .catch(err => {
    // dispatch(hideLoader());
    // });
  };
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <CustomScrollView
      contentStyle={{ paddingBottom: 10 }}
      showBackground={false}
      backgroundColor={colors.white}
    >
      <Image
        style={dynamicStyles(colors).changeimage}
        source={images.changeimage}
      />
      <CustomText fontSize={28} style={dynamicStyles(colors).title}>
        {t('resetPasswordTitle')}
      </CustomText>
      <CustomText
        color={colors.greaytext}
        style={{ letterSpacing: 1 }}
        fontSize={12}
      >
        {t('resetPasswordSubtitle')}
      </CustomText>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View
              style={{
                marginTop: heightPixel(20),
                flex: 1,
              }}
            >
              <CustomTextInput
                passwordField
                icon={icons.lock}
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                returnKeyType="next"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errors={errors.password}
                focus={touched.password}
              />

              <CustomTextInput
                passwordField
                icon={icons.lock}
                label={t('confirmPasswordLabel')}
                placeholder={t('confirmPasswordPlaceholder')}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                errors={errors.confirmPassword}
                focus={touched.confirmPassword}
              />

              <View style={dynamicStyles(colors).instructionsView}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={dynamicStyles(colors).dotStyle} />
                  <CustomText
                    style={{ letterSpacing: 1 }}
                    fontSize={12}
                    color={colors.black}
                  >
                    {t('passwordRuleLength')}
                  </CustomText>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={dynamicStyles(colors).dotStyle} />
                  <CustomText
                    style={{ letterSpacing: 1 }}
                    fontSize={12}
                    color={colors.black}
                  >
                    {t('passwordRuleCombination')}
                  </CustomText>
                </View>
              </View>
            </View>

            <CustomButton
              title={t('Continue')}
              gradient
              // onPress={handleSubmit}
              onPress={() => reset(screens.login)}
            />
          </>
        )}
      </Formik>
    </CustomScrollView>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    dotStyle: {
      height: 7,
      width: 7,
      borderRadius: 10,
      marginRight: 10,
      marginTop: 6,
      backgroundColor: colors.purple1,
    },
    changeimage: {
      height: heightPixel(250),
      width: widthPixel(250),
      resizeMode: 'contain',
      marginBottom: 0,
      alignSelf: 'center',
    },
    title: {
      fontWeight: '700',
      letterSpacing: 1,
    },
    subTitleStyle: {
      // marginTop: heightPixel(10),
      textAlign: 'center',
      width: '90%',
    },
    containerStyle: {
      // alignItems: 'center',
      marginTop: heightPixel(10),
    },
    instructionsView: {
      marginTop: 35,
      flex: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
  });
