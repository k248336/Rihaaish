import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  getAppStyles,
  icons,
  images,
  navigate,
  replace,
  screens,
} from '../../utilities';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { CustomButton, CustomText } from '../../components';
import { setOnboardingComplete } from '../../redux/slices';
import { useAppDispatch, useTheme } from '../../hooks';

export default function Prelogin() {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const dispatch = useAppDispatch();

  return (
    <ImageBackground
      source={images.prelogin}
      style={{
        flex: 1,
        paddingHorizontal: widthPixel(20),
      }}
    >
      <View style={dynamicStyles(colors).contentview}>
        <Image source={images.appLogo} style={dynamicStyles(colors).appIcon} />
        <CustomText
          color={colors.white}
          style={{ marginBottom: 10 }}
          weight="bold"
          fontSize={32}
        >
          Learn From the People Who Live It
        </CustomText>
        <CustomText
          style={{
            marginBottom: 10,
            lineHeight: 25,
            maxWidth: 290,
            alignSelf: 'flex-start',
          }}
          color={colors.white}
          weight="regular"
          fontSize={14}
        >
          Register Now to Gain Access to Hundreds of Experts in Your Field of
          Interest!
        </CustomText>
        <CustomButton
          btnStyle={[dynamicStyles(colors).btn, { marginBottom: 0 }]}
          onPress={() => {
            dispatch(setOnboardingComplete());
            replace(screens.onBoarding);
          }}
          txtColor={colors.black}
          title="Get Started"
          backgroundColor={colors.white}
        />
        <CustomText
          onPress={() => {
            replace(screens.login);
          }}
          style={{
            marginBottom: 30,
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
          }}
          color={colors.white}
          weight="regular"
          fontSize={12}
        >
          I Already have an Account Sign In
        </CustomText>
        <CustomButton
          btnStyle={dynamicStyles(colors).btn}
          // onPress={() => {
          //   dispatch(setOnboardingComplete());
          //   replace(screens.login);
          // }}
          txtSize={10}
          rightIconStyles={{
            tintColor: colors.white,
          }}
          rightIcon={images.appleLogo}
          title="Continue with Apple"
          backgroundColor={'#101010'}
        />
        <CustomButton
          btnStyle={dynamicStyles(colors).btn}
          onPress={() => {
            ('');
          }}
          txtSize={10}
          rightIcon={images.googleLogo}
          title="Continue with Google"
          backgroundColor={'#101010'}
        />
      </View>
    </ImageBackground>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
  appIcon: {
    height: heightPixel(46.85),
    width: widthPixel(127.03),
    tintColor: colors.white,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    marginTop: 15,
  },
  contentview: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
    gap: 0,
  },
});
