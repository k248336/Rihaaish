import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { getAppStyles, getColors } from '../utilities';
import { CustomButtonProps } from '../interface';
import CustomText from './CustomText';
import { useTheme } from '../hooks';

const CustomButton: FC<CustomButtonProps> = ({
  title,
  onPress,
  btnStyle,
  titleColor,
  titleStyle,
  disabled,
  icon,
  gradient,
  gradientColors,
  rightIcon,
  rightIconStyles,
  txtColor,
  txtSize,
  backgroundColor,
  subTitle,
  subTitleTxtSize,
  subTitleTxtColor,
  iconStyle,
  titleTxtWeight,
  titleFontFamily,
}) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const Content = () => (
    <>
      {rightIcon && (
        <Image
          resizeMode="contain"
          source={rightIcon}
          style={[
            {
              width: widthPixel(20),
              height: heightPixel(20),
              marginRight: 10,
              resizeMode: 'contain',
              tintColor: txtColor ?? colors.white, 
            },
            rightIconStyles,
          ]}
        />
      )}
      <CustomText
        textAlignCenter
        style={titleStyle}
        fontSize={txtSize ?? 16}
        weight={titleTxtWeight ?? 'bold'}
        fontfamily={titleFontFamily ?? 'Gilroy'}
        color={txtColor ?? '#FFF'}
      >
        {title}
      </CustomText>

      {subTitle && (
        <CustomText
          fontSize={subTitleTxtSize ?? 16}
          weight="semibold"
          color={subTitleTxtColor ?? colors.white}
        >
          {subTitle}
        </CustomText>
      )}

      {icon && (
        <Image
          resizeMode="contain"
          source={icon}
          style={[{ width: 14, height: 14, tintColor: txtColor ?? colors.white }, iconStyle]} // Apply tint color for icon
        />
      )}
    </>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        dynamicStyles(colors).container,
        !gradient && backgroundColor
          ? { backgroundColor }
          : !gradient && {
              backgroundColor: disabled
                ? `${colors.primary}99`
                : colors.primary,
            },
        icon ? appStyles.flexRowBetween : undefined,
        rightIcon
          ? [appStyles.flexRowBetween, { justifyContent: 'center' }]
          : undefined,
        btnStyle,
      ]}
    >
      {gradient ? (
        <LinearGradient
          colors={gradientColors ?? [colors.purple1, colors.purple2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            dynamicStyles(colors).gradientContainer,
            icon ? appStyles.flexRowBetween : undefined,
            rightIcon
              ? [appStyles.flexRowBetween, { justifyContent: 'center' }]
              : undefined,
            btnStyle,
          ]}
        >
          <Content />
        </LinearGradient>
      ) : (
        <Content />
      )}
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(50),
    marginTop: heightPixel(20),
    borderRadius: heightPixel(30),
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    borderRadius: heightPixel(30),
  },
});

export default CustomButton;
