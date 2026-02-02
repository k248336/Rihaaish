import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../CustomButton';
import CustomText from '../CustomText';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { icons, deviceHeight, getAppStyles } from '../../utilities';
import { useTheme } from '../../hooks';

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({
  visible,
  onConfirm,
  onCancel,
}: LogoutModalProps) {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  return (
    <Modal
      useNativeDriver
      statusBarTranslucent
      isVisible={visible}
      backdropOpacity={0.8}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={dynamicStyles(colors).modalStyle}
      onBackdropPress={onCancel}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      deviceHeight={deviceHeight + deviceHeight}
    >
      <View style={dynamicStyles(colors).container}>
        <View style={dynamicStyles(colors).iconContainer}>
          <Image
            source={icons.logout}
            style={dynamicStyles(colors).logoutIcon}
          />
        </View>

        <CustomText
          color={colors.black}
          style={dynamicStyles(colors).titleStyle}
          fontSize={18}
          weight="semibold"
        >
          Logout
        </CustomText>

        <CustomText
          fontSize={14}
          color={colors.gray}
          style={dynamicStyles(colors).subTextStyle}
        >
          Are you sure you want to logout?
        </CustomText>

        <View style={dynamicStyles(colors).buttonsContainer}>
          <CustomButton
            txtSize={14}
            onPress={onCancel}
            backgroundColor={colors.transparent}
            txtColor={colors.black}
            btnStyle={dynamicStyles(colors).cancelButton}
            title="Cancel"
          />

          <CustomButton
            txtSize={14}
            title="Logout"
            onPress={onConfirm}
            btnStyle={dynamicStyles(colors).logoutButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    modalStyle: {
      margin: 0,
    },
    container: {
      borderWidth: 1,
      alignItems: 'center',
      borderRadius: heightPixel(20),
      paddingVertical: heightPixel(30),
      paddingHorizontal: widthPixel(20),
      marginHorizontal: widthPixel(20),
      backgroundColor: colors.white,
      borderColor: colors.yellowMedium,
    },
    iconContainer: {
      width: widthPixel(60),
      height: heightPixel(60),
      borderRadius: heightPixel(30),
      backgroundColor: '#FFE5E5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: heightPixel(20),
    },
    logoutIcon: {
      width: widthPixel(24),
      height: heightPixel(24),
      resizeMode: 'contain',
      tintColor: '#EF6F6F',
    },
    titleStyle: {
      textAlign: 'center',
      marginBottom: heightPixel(10),
    },
    subTextStyle: {
      textAlign: 'center',
      marginBottom: heightPixel(25),
      lineHeight: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: widthPixel(15),
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      height: heightPixel(45),
      borderWidth: 1,
      borderColor: colors.black,
    },
    logoutButton: {
      flex: 1,
      height: heightPixel(45),
      backgroundColor: '#EF6F6F',
    },
  });
