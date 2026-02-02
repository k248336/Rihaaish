import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAppStyles, icons, navigate, screens } from '../utilities';
import CustomText from './CustomText';
import { useAppDispatch, useAppSelector, useTheme } from '../hooks';
import { toggleTheme } from '../redux/slices/theme';
import { WelcomeHeaderProps } from '../interface';
import { useTranslation } from '../utilities/translations';

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  name,
  profile = null,
  containerStyle,
  hideProfile,
}) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <View style={[dynamicStyles(colors).container, containerStyle]}>
      {!hideProfile && (
        <View style={dynamicStyles(colors).left}>
          <Image
            source={icons.profiletab}
            style={dynamicStyles(colors).avatar}
          />
          <View style={{ marginLeft: 10 }}>
            <CustomText color={colors.primary} weight="regular">
              Welcome 👋
            </CustomText>
            <CustomText color={colors.primary} fontSize={20} weight="bold">
              {name}
            </CustomText>
          </View>
        </View>
      )}

      {hideProfile && (
        <View style={dynamicStyles(colors).left}>
          <CustomText color={colors.primary} fontSize={20} weight="regular">
            {t(name)}
          </CustomText>
        </View>
      )}

      <View style={dynamicStyles(colors).right}>
        <TouchableOpacity
          onPress={() => {
            navigate(screens.notifications);
          }}
          activeOpacity={0.8}
          style={dynamicStyles(colors).iconWrapper}
        >
          <Image
            source={icons.notification}
            style={{ height: 16, width: 16 }}
          />
          <View style={dynamicStyles(colors).redDot} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigate(screens.SupportChat);
          }}
          activeOpacity={0.8}
          style={dynamicStyles(colors).iconWrapper}
        >
          <Image source={icons.message} style={{ height: 16, width: 16 }} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => dispatch(toggleTheme())}
          style={[
            dynamicStyles(colors).iconWrapper,
            { backgroundColor: isDarkMode ? '#000' : '#111' },
          ]}
        >
          <Image
            source={isDarkMode ? icons.darkmode : icons.lightmode}
            style={{ height: 16, width: 16 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      // paddingVertical: 12,
      flexDirection: 'row',
      backgroundColor: colors.background,
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    left: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    avatar: {
      width: 35,
      height: 35,
      // borderRadius: 999,
    },

    right: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconWrapper: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: '#fff',
      marginLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      elevation: 2,
    },

    redDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'red',
      position: 'absolute',
      top: 8,
      right: 8,
    },
  });

export default WelcomeHeader;
