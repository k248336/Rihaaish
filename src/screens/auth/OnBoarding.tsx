import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  PanResponder,
  Easing,
  Text,
} from 'react-native';
import { useAppDispatch, useTheme } from '../../hooks';
import { CustomText } from '../../components';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { setOnboardingComplete } from '../../redux/slices';
import LinearGradient from 'react-native-linear-gradient';

import {
  getColors,
  images,
  replace,
  screens,
  utility,
  getAppStyles,
  icons,
} from '../../utilities';

/** Theme-safe colors for Animated interpolation (outputRange must not include undefined). */
const slideIconTintMid = '#B8ACFC';

const OnBoarding = () => {
  const dispatch = useAppDispatch();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const translateX = useRef(new Animated.Value(0)).current;
  const [completed, setCompleted] = useState(false);

  const buttonWidth = widthPixel(345);
  const circleSize = heightPixel(52);
  const padding = widthPixel(10);
  const maxDrag = buttonWidth - circleSize - padding * 2;
  const threshold = maxDrag;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let dx = Math.max(0, Math.min(gesture.dx, maxDrag));
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx >= threshold) {
          setCompleted(true);
          Animated.spring(translateX, {
            toValue: maxDrag,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(() => {
              Animated.timing(translateX, {
                toValue: maxDrag,
                duration: 0,
                easing: Easing.out(Easing.circle),
                useNativeDriver: true,
              }).start(() => {
                dispatch(setOnboardingComplete());
                replace(screens.login);
              });
            }, 500);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => setCompleted(false));
        }
      },
    }),
  ).current;

  return (
    <ImageBackground
      source={images.onboarding}
      style={dynamicStyles(colors).imageContainer}
      imageStyle={dynamicStyles(colors).imageStyle}
    >
      <View style={{ flex: 1 }} />
      <View
        style={{
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <Image style={dynamicStyles(colors).logo} source={icons.logo} tintColor={colors.purple2} />
        <CustomText
          color={colors.black}
          fontSize={28}
          style={{ fontWeight: '300', lineHeight: 30, marginTop: heightPixel(8) }}
        >
          Perfect choice
        </CustomText>
        <CustomText
          fontSize={42}
          color={colors.primary}
          style={{ fontWeight: '800', lineHeight: 48, marginTop: heightPixel(0) }}
        >
          for your future.
        </CustomText>
        <CustomText
          fontSize={14}
          color={'#333333'}
          style={{
            letterSpacing: 0.2,
            lineHeight: 22,
            marginTop: heightPixel(0),
            fontWeight: '400',
          }}
        >
          Our properties the masterpiece for every client with lasting value.
        </CustomText>
      </View>

      <View style={dynamicStyles(colors).wrapper}>
        <Animated.View
          style={[
            dynamicStyles(colors).whiteOverlay,
            {
              opacity: 1,
            },
          ]}
        />

        <Animated.View
          style={[
            dynamicStyles(colors).gradientTrack,
            {
              opacity: translateX.interpolate({
                inputRange: [0, threshold * 0.2, threshold],
                outputRange: [0, 0.4, 1],
                extrapolate: 'clamp',
              }),
              width: translateX.interpolate({
                inputRange: [0, maxDrag],
                outputRange: [circleSize + padding * 2, buttonWidth],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[colors.purple1, colors.purple2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: 40 }]}
          />
        </Animated.View>

        <Animated.View
          style={[
            dynamicStyles(colors).homeCircle,
            {
              transform: [{ translateX }],
              backgroundColor: translateX.interpolate({
                inputRange: [0, threshold * 0.8, threshold],
                outputRange: ['transparent', colors.white, colors.white],
                extrapolate: 'clamp',
              }),
              position: 'absolute',
              left: padding,
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 30,
              opacity: translateX.interpolate({
                inputRange: [0, threshold - 1, threshold],
                outputRange: [1, 0.5, 0],
                extrapolate: 'clamp',
              }),
            }}
          >
            <LinearGradient
              colors={[colors.purple1, colors.purple2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={dynamicStyles(colors).homeGradient}
            />
          </Animated.View>

          <Animated.Image
            source={icons.home}
            resizeMode="contain"
            style={[
              dynamicStyles(colors).icon,
              {
                tintColor: translateX.interpolate({
                  inputRange: [0, threshold * 0.8, threshold],
                  outputRange: [colors.white, slideIconTintMid, colors.purple1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </Animated.View>

        <Animated.Text
          style={[
            dynamicStyles(colors).text,
            {
              color: translateX.interpolate({
                inputRange: [0, threshold * 0.8, threshold],
                outputRange: [colors.black, colors.greaytext, colors.white],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          Get Started
        </Animated.Text>

        <Animated.View
          style={[
            dynamicStyles(colors).checkCircle,
            {
              opacity: translateX.interpolate({
                inputRange: [0, threshold - 1, threshold],
                outputRange: [1, 0.5, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <Image source={icons.tick} style={dynamicStyles(colors).icon} resizeMode="contain" tintColor={colors.greaytext} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const dynamicStyles = (colors: any) => StyleSheet.create({
  logo: {
    width: widthPixel(44),
    height: heightPixel(39),
  },

  imageContainer: {
    flex: 1,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  wrapper: {
    width: widthPixel(345),
    height: 70,
    marginBottom: '5%',
    alignSelf: 'center',
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'relative',
  },

  gradientTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    borderRadius: 40,
  },
  text: {
    color: colors.white,
    fontWeight: '400',
    fontSize: 14,
  },
  homeCircle: {
    position: 'absolute',
    left: widthPixel(10),
    width: heightPixel(52),
    height: widthPixel(52),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  homeGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    position: 'absolute',
    right: 10,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: colors.lightergray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default OnBoarding;
