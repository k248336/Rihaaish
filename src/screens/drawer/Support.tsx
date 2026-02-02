import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  appStyles,
  colors,
  icons,
  images,
  navigate,
  screens,
} from '../../utilities';
import CustomText from '../../components/CustomText';
import { CustomScrollView } from '../../components';
import { heightPixel, widthPixel } from '../../utilities/helpers';

const Support = () => {
  return (
    <CustomScrollView contentStyle={[appStyles.container, styles.container]}>
      <Image source={images.supportimage} style={styles.supportimage} />

      <CustomText fontSize={26} weight="semibold" color={colors.black}>
        How we can help you?
      </CustomText>
      <CustomText fontSize={16} color={colors.gray} style={styles.subtitle}>
        We are here to help. Please click on our FAQ
      </CustomText>
      <View style={appStyles.flexrow}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Image source={icons.supportemail} style={styles.icon} />
          <CustomText weight="bold" fontSize={16}>
            Email Us
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate(screens.chat);
          }}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Image source={icons.supportchat} style={styles.icon} />
          <CustomText weight="bold" fontSize={16}>
            Chat with Us
          </CustomText>
        </TouchableOpacity>
      </View>
    </CustomScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    height: heightPixel(33),
    width: widthPixel(39),
    resizeMode: 'contain',
  },
  button: {
    height: heightPixel(150),
    width: widthPixel(160),
    alignItems: 'center',
    justifyContent: 'center',
    gap: heightPixel(10),
    marginTop: heightPixel(30),
    margin: 10,
    borderRadius: heightPixel(20),
    backgroundColor: colors.textfieldcolor,
  },
  supportimage: {
    height: heightPixel(241),
    width: widthPixel(250),
    marginVertical: heightPixel(20),
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 250,
    textAlign: 'center',
    lineHeight: 25,
  },
});

export default Support;
