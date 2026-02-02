import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { heightPixel } from '../../utilities/helpers';
import {
  colors,
  getAppStyles,
  icons,
  navigate,
  screens,
  strings,
  utility,
} from '../../utilities';
import { useAppDispatch, useTheme } from '../../hooks';
import {
  HeadingComp,
  CustomButton,
  CustomTextInput,
  CustomScrollView,
} from '../../components';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const initialValues = {
  email: '',
};

export default function ForgotPassword() {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const dispatch = useAppDispatch();
  const handleSubmit = (values: any) => {
    // dispatch(showLoader());

    var data = {
      email: values.email,
    };
    navigate(screens.otpVerification, {
      email: values.email,
      isForgotPass: true,
    });

    // dispatch(sendOtp(data))
    //   .unwrap()
    //   .then(res => {
    //     // console.log('forgotPassword res: ', res);

    //     dispatch(hideLoader());
    //     utility.showAlertMessage('success', strings.verifyYourEmail);
    //     navigate(screens.otpVerification, {
    //       email: values.email,
    //       isForgotPass: true,
    //     });
    //   })
    //   .catch(err => {
    //     dispatch(hideLoader());
    //   });
  };

  return (
    <View style={appStyles.container}>
      <CustomScrollView contentStyle={{ flex: 1 }}>
        <HeadingComp
          title="Forgot Password"
          subTitle="you need to enter your registered Email Address."
          titleTxtSize={22}
          subTitleTxtSize={12}
          titleTxtColor={colors.black}
          subTitleTxtColor={colors.black}
          titletxtWeight="bold"
          subTitleTxtWeight="regular"
          titleStyle={dynamicStyles(colors).titleStyle}
          subTitleStyle={dynamicStyles(colors).subTitleStyle}
          containerStyle={dynamicStyles(colors).headerContainerStyle}
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values: data,
            errors,
            touched,
          }) => (
            <>
              <View style={{ marginTop: heightPixel(25), flex: 1 }}>
                <View style={dynamicStyles(colors).mainContainer}>
                  <CustomTextInput
                    label="Email Address"
                    icon={icons.email}
                    placeholder="Email Address"
                    returnKeyType="next"
                    value={data.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    errors={errors.email}
                    focus={touched.email}
                  />
                </View>
              
              </View>
              <CustomButton
                  gradient
                  title="Continue"
                  // onPress={handleSubmit}
                  onPress={() => {
                    navigate(screens.otpVerification, {
                      email: data.email,
                      isForgotPass: true,
                    });
                  }}
                  btnStyle={{
                    marginTop: heightPixel(0),
                  }}
                />
            </>
          )}
        </Formik>
      </CustomScrollView>
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    headerContainerStyle: {
      alignSelf: 'center',
    },
    mainContainer: {
      flex: 1,
    },
    subTitleStyle: {
      textAlign: 'center',
      marginTop: heightPixel(5),
      letterSpacing: 1,
    },
    titleStyle: {
      alignSelf: 'center',
      maxWidth: 300,
      fontWeight: '500',
      textAlign: 'center',
    },
  });
