import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
  CustomButton,
  CustomScrollView,
  CustomText,
} from '../../../components';
import { getAppStyles, getColors, goBack, icons } from '../../../utilities';
import { setLanguage } from '../../../redux/slices/language';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useAppDispatch, useAppSelector, useTheme } from '../../../hooks';

export default function Language() {
  const currentLanguage = useAppSelector(
    state => state?.language?.currentLanguage,
  );
  const [selected, setSelected] = useState(currentLanguage);
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const dispatch = useAppDispatch();

  

  const languages = [
    { code: 'en', label: 'English', image: icons.english },
    { code: 'es', label: 'Spanish', image: icons.spanish },
    { code: 'de', label: 'Germany', image: icons.germany },
  ];

  return (
    <CustomScrollView
      contentStyle={{ paddingBottom: 20 }}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          gap: heightPixel(5),
          marginBottom: heightPixel(30),
        }}
      >
        <CustomText fontSize={18} weight="bold" color={colors.primary}>
          Choose your language
        </CustomText>
        <CustomText
          style={{ maxWidth: 270 }}
          textAlignCenter
          fontSize={14}
          weight="regular"
          color={colors.greaytext}
        >
          Select your preferred language to use go my go easily
        </CustomText>
      </View>
      <View style={{ flex: 1 }}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              dynamicStyles(colors).button,
              selected === lang.code && dynamicStyles(colors).activeButton,
            ]}
            onPress={() => setSelected(lang?.code)}
          >
            <View style={[appStyles.flexRow, { gap: 10 }]}>
              <Image source={lang.image} style={dynamicStyles(colors).image} />
              <CustomText
                weight={selected === lang.code ? 'bold' : 'regular'}
                color={selected === lang.code ? colors.purple1 : colors.primary}
              >
                {lang.label}
              </CustomText>
            </View>
            <View>
              {selected === lang.code ? (
                <Image
                  tintColor={isDarkMode ? 'white' : colors.purple1}
                  source={icons.verified}
                  style={dynamicStyles(colors).verifiedicon}
                />
              ) : (
                <View style={dynamicStyles(colors).unverfied} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <CustomButton onPress={() => {
        if (selected) {
          dispatch(setLanguage(selected));
        }
        goBack();
      }} gradient title="Continue" />
    </CustomScrollView>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    unverfied: {
      borderColor: colors.purple2,
      borderWidth: 1,
      borderRadius: 100,
      height: 20,
      width: 20,
    },
    verifiedicon: {
      height: heightPixel(20),
      width: widthPixel(20),
      resizeMode: 'contain',
    },
    image: {
      height: heightPixel(20),
      width: widthPixel(20),
    },

    button: {
      width: '100%',
      borderWidth: 1.5,
      borderColor: colors.borderGrey,
      gap: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: heightPixel(45),
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.white,
      marginBottom: 15,
      alignItems: 'center',
    },
    activeButton: {
      borderColor: colors.purple2,
    },
    buttonText: {
      fontSize: 18,
      color: colors.primary,
    },
    activeText: {
      color: colors.purple1,
      fontWeight: 'bold',
    },
    continueBtn: {
      marginTop: 20,
      padding: 15,
      width: '100%',
      backgroundColor: colors.purple1,
      borderRadius: 10,
      alignItems: 'center',
    },
    continueText: {
      color: colors.white,
      fontSize: 18,
      fontWeight: '700',
    },
  });
