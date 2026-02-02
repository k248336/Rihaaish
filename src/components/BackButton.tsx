import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPixel } from '../utilities/helpers';
import { BackButtonProps } from '../interface';
import {
  getAppStyles,
  getShadows,
  icons,
  pop,
} from '../utilities';
import { useTheme } from '../hooks';

const BackButton: FC<BackButtonProps> = ({
  onPress,
  style,
  icon,
  iconSize,
  imgStyle,
}) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const Shadows = getShadows(isDarkMode);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[dynamicStyles(colors).container, style]}
      onPress={() => (onPress ? onPress() : pop())}
    >
      <Image
        resizeMode="contain"
        source={icon || icons.backArrow}
        // tintColor={icon && colors.primary}
        style={[
          {
            width: heightPixel(iconSize || 12),
            height: heightPixel(iconSize || 12),
          },
          imgStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      // marginLeft: widthPixel(12),
      height: heightPixel(40),
      width: heightPixel(40),
      borderRadius: heightPixel(40),
      // flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // alignSelf: 'flex-start',
      backgroundColor: colors.white,
      // ...Shadows.shadow3,
    },
  });

export default BackButton;
