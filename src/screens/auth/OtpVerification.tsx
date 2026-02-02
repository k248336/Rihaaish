import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  Cursor,
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import useOTPControllers from '../../controllers/AuthControllers/OTPControllers';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { getAppStyles, getColors, images } from '../../utilities';
import { CustomText, CustomButton, CustomScrollView } from '../../components';
import { useTheme } from '../../hooks';
import { useTranslation } from '../../utilities/translations';

const CELL_COUNT = 4;

export default function OtpVerification({ route }: any) {
  const { email, isForgotPass } = route?.params;
  const { values, functions } = useOTPControllers();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    functions._timer();
  }, []);

  return (
    <CustomScrollView
      showBackground={false}
      backgroundStyle={{ backgroundColor: colors.background }}
      contentStyle={{ paddingBottom: 10 }}
    >
      <Image source={images.otpimage} style={dynamicStyles(colors).otpimage} />
      <CustomText
        fontSize={28}
        style={dynamicStyles(colors).title}
        color={colors.primary}
      >
        {t('verificationTitle')}
      </CustomText>
      <View style={[appStyles.flexRow, dynamicStyles(colors).description]}>
        <CustomText style={{ letterSpacing: 1 }} color={colors.greaytext}>
          {t('descriptionPart1')}
        </CustomText>
        <CustomText style={dynamicStyles(colors).bold} color={colors.primary}>
          {t('oneTimePassword')}{' '}
        </CustomText>
        <CustomText style={{ letterSpacing: 1 }} color={colors.greaytext}>
          {t('descriptionPart2')}{' '}
        </CustomText>
      </View>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={dynamicStyles(colors).rootStyle}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[
                dynamicStyles(colors).codeFieldStyle,
                isFocused && dynamicStyles(colors).focusCellStyle,
                ,
                {
                  backgroundColor: isDarkMode ? colors.gray : colors.white,
                },
              ]}
            >
              {symbol ? (
                <CustomText
                  onLayout={getCellOnLayoutHandler(index)}
                  color={isFocused ? colors.white : colors.black}
                  weight="medium"
                >
                  {symbol}
                </CustomText>
              ) : isFocused ? (
                <Text
                  style={{
                    color: isFocused ? colors.purple1 : colors.black,
                  }}
                >
                  <Cursor />
                </Text>
              ) : (
                <CustomText
                  onLayout={getCellOnLayoutHandler(index)}
                  color={colors.black}
                  weight="medium"
                >
                  -
                </CustomText>
              )}
            </View>
          )}
        />
        {values.timer == '00' ? (
          <CustomButton
            disabled={values.timer != '00'}
            title={`Resend  ${
              values.timer == '00' ? `Code` : `in ${values.timer}`
            }`}
            btnStyle={dynamicStyles(colors).resendBtn}
            txtColor={colors.white}
            txtSize={12}
            onPress={() => functions.onResendCode(email)}
            titleStyle={{
              fontSize: 14,
              fontWeight: '400',
              color: colors.white,
            }}
          />
        ) : (
          <CustomText
            style={dynamicStyles(colors).timertext}
            fontSize={12}
            color={colors.greaytext}
          >
            {t('requestAgain')} {values.timer}
          </CustomText>
        )}
      </View>

      <CustomButton
        title={t('continue')}
        gradient
        onPress={() => functions.handleonSubmit(isForgotPass, value, email)}
      />
    </CustomScrollView>
  );
}
const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    otpimage: {
      height: 300,
      width: 300,
      alignSelf: 'center',
    },
    description: {
      flexWrap: 'wrap',
      gap: 2,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: heightPixel(10),
    },
    bold: {
      fontWeight: '800',
      letterSpacing: 1,
    },
    title: {
      fontWeight: '500',
      textAlign: 'center',
      letterSpacing: 1,
      marginTop: heightPixel(20),
      flex: 1,
    },
    focusCellStyle: {
      borderBottomWidth: 2,
      borderColor: colors.purple2,
    },
    titleStyle: {
      maxWidth: 330,
      alignSelf: 'center',
      textAlign: 'center',
    },
    subTitleStyle: {
      marginTop: heightPixel(25),
      textAlign: 'center',
      width: '90%',
    },
    containerStyle: {
      alignItems: 'center',
      marginTop: heightPixel(30),
    },
    timertext: {
      marginTop: heightPixel(10),
      letterSpacing: 1,
    },
    codeFieldStyle: {
      width: widthPixel(47),
      height: heightPixel(47),
      borderWidth: 2,
      marginBottom: 8,
      alignItems: 'center',
      borderRadius: 100,
      justifyContent: 'center',
      // backgroundColor: isDarkMode ? colors.darkgray : colors.white,
      // borderColor: isDarkMode ? colors.darkgrey : colors.subtitle,
    },
    resendBtn: {
      marginTop: heightPixel(49),
      backgroundColor: colors.red,
      width: widthPixel(130),
      alignSelf: 'center',
      height: heightPixel(42),
    },
    rootStyle: {
      flexWrap: 'wrap',
      width: 280,
      alignSelf: 'center',
      marginTop: heightPixel(30),
    },
    btnStyle: { marginTop: heightPixel(62) },
  });
