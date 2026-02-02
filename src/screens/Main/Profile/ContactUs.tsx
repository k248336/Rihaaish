import { Image, StyleSheet, Text, View, Switch } from 'react-native';
import React from 'react';
import {
  CustomButton,
  CustomScrollView,
  CustomText,
  CustomSwitch,
} from '../../../components';
import { getAppStyles, icons, utility } from '../../../utilities';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useTheme } from '../../../hooks';

export default function ContactUs() {
  const { colors, isDarkMode } = useTheme();

  return (
    <CustomScrollView>
      <View style={{ flex: 1, gap: heightPixel(10) }}>
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center',gap:10 }}
        >
          <Image
            style={dynamicStyles(colors).icon}
            resizeMode="contain"
            source={icons.infoicon}
          />
          <CustomText  fontSize={26} weight="bold" color={colors.primary}>
            Need Help?
          </CustomText>
          <CustomText textAlignCenter fontSize={12} color={colors.greaytext}>
            Please feel free to call us or email us, We’ll surely try to connect
            you as soon as possible
          </CustomText>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          gap: 20,
        }}
      >
        <CustomButton
          btnStyle={dynamicStyles(colors).button}
          title="Call Us"
          gradient
          onPress={
            () => {
              utility.openDialer('+923223525116');
            }
            // if (item?.email) {
            // utility.openMail(item?.email);
            // } else if (item?.phone) {
            // }
          }
        />
        <CustomButton
          btnStyle={dynamicStyles(colors).button}
          title="Email Us"
          gradient
          onPress={() => {
            utility.openMail('support@yopmail.com');
          }}
        />
      </View>
    </CustomScrollView>
  );
}
const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      marginTop: 0,
      width: widthPixel(343),
    },
    icon: {
      height: heightPixel(100),
      width: widthPixel(100),
      alignSelf: 'center',
    },
  });
