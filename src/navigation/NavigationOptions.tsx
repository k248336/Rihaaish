import React from 'react';
import {
  View,
  Image,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CustomButton, CustomText } from '../components';
import { getAppStyles, icons, navigate, screens } from '../utilities';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { useAppSelector, useTheme } from '../hooks';

const headerLeftTitle = (title: string, color?: string) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  return {
    headerTitle: () => (
      <CustomText fontSize={18} weight="bold" color={color || colors.white}>
        {title}
      </CustomText>
    ),
  };
};

const headerRightNotiIcon = () => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { unreadCount } = useAppSelector(state => state.notification);

  return {
    headerRight: () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigate(screens.notifications)}
        >
          <Image
            resizeMode="contain"
            source={icons.notificationIcon}
            style={dynamicStyles(colors).notiIconStyle}
          />
          {unreadCount > 0 && <View style={dynamicStyles(colors).dot} />}
        </TouchableOpacity>
      );
    },
  };
};

const headerRightBtn = (
  title: string,
  onPressOrRoute: string | (() => void),
  paramsOrOptions?: any,
  customStyle?: ViewStyle,
  customIcon?: any,
  rightIconStyle?: ViewStyle,
  txtColor?: string,
) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const isCallback = typeof onPressOrRoute === 'function';
  const onPress = isCallback
    ? onPressOrRoute
    : () => navigate(onPressOrRoute, paramsOrOptions);

  const iconToUse = customIcon || null;

  return {
    headerRight: () => (
      <CustomButton
        rightIcon={iconToUse ? iconToUse : ''}
        rightIconStyles={rightIconStyle}
        title={title}
        txtSize={12}
        txtColor={txtColor}
        onPress={onPress}
        btnStyle={[dynamicStyles(colors).btnStyle, customStyle]}
      />
    ),
  };
};

const headerRightMultipleIcons = (icons: any[], size: number) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  return {
    headerRight: () => (
      <View style={[appStyles.flexRow as ViewStyle]}>
        {icons.map((icon, index) => (
          <TouchableOpacity key={index} activeOpacity={0.7}>
            <Image
              resizeMode="contain"
              source={icon}
              style={{
                marginLeft: widthPixel(10),
                width: heightPixel(size || 20),
                height: heightPixel(size || 20),
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    notiIconStyle: {
      height: heightPixel(20),
      width: heightPixel(20),
    },
    dot: {
      top: -2,
      right: 2,
      position: 'absolute',
      width: heightPixel(8),
      height: heightPixel(8),
      borderRadius: heightPixel(8),
      backgroundColor: colors.primary,
    },
    btnStyle: {
      height: heightPixel(25),
      marginTop: heightPixel(0),
      paddingHorizontal: widthPixel(15),
    },
  });

export {
  headerRightBtn,
  headerLeftTitle,
  headerRightNotiIcon,
  headerRightMultipleIcons,
};
