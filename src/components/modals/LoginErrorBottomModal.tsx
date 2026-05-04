import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../CustomButton';
import CustomText from '../CustomText';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { deviceHeight, icons } from '../../utilities';
import { useTheme } from '../../hooks';

const ACTION_TEAL = '#00A884';
const SUCCESS_RING = '#DCFCE7';
// const ALERT_RING = '#FEF3C7';
// const ALERT_ICON_TINT = '#D97706';

type LoginModalMode = 'success' | 'error' | 'verify';

type LoginErrorBottomModalProps = {
  visible: boolean;
  mode: LoginModalMode;
  headerTitle: string;
  message: string;
  showButton: boolean;
  onBackdropPress: () => void;
  onButtonPress: () => void;
  buttonTitle: string;
};

export default function LoginErrorBottomModal({
  visible,
  mode,
  headerTitle,
  message,
  showButton,
  onBackdropPress,
  onButtonPress,
  buttonTitle,
}: LoginErrorBottomModalProps) {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const isSuccess = mode === 'success';

  return (
    <Modal
      useNativeDriver
      statusBarTranslucent
      isVisible={visible}
      onBackdropPress={onBackdropPress}
      backdropOpacity={0.45}
      backdropColor="#000"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modalRoot}
      hideModalContentWhileAnimating
      avoidKeyboard
      deviceHeight={deviceHeight + deviceHeight}
    >
      <View
        style={[
          dynamicStyles(colors, isDarkMode).sheet,
          { paddingBottom: Math.max(insets.bottom, heightPixel(16)) },
        ]}
      >
        <View style={dynamicStyles(colors, isDarkMode).grabber} />

        <View style={styles.contentBlock}>
          <View
            style={[
              styles.iconRing,
              {
                backgroundColor: isSuccess
                  ? isDarkMode
                    ? '#14532D'
                    : SUCCESS_RING
                  : isDarkMode
                    ? '#78350F'
                    : ''
                    // ALERT_RING,
              },
            ]}
          >
            <Image
              source={isSuccess ? icons.successicon : icons.warning}
              style={styles.iconImg}
              resizeMode="contain"
              // {...(!isSuccess ? { tintColor: ALERT_ICON_TINT } : {})}
            />
          </View>

          <CustomText
            fontSize={20}
            weight="semibold"
            color={colors.primary}
            style={styles.title}
            textAlignCenter
          >
            {headerTitle}
          </CustomText>

          <CustomText
            fontSize={16}
            color={colors.greaytext}
            style={styles.message}
            textAlignCenter
          >
            {message}
          </CustomText>
        </View>

        {showButton ? (
          <CustomButton
            gradient={false}
            backgroundColor={ACTION_TEAL}
            title={buttonTitle}
            onPress={onButtonPress}
            btnStyle={styles.cta}
            txtSize={16}
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentBlock: {
    paddingHorizontal: widthPixel(8),
    marginBottom: heightPixel(6),
    alignItems: 'center',
  },
  iconRing: {
    // width: widthPixel(72),
    // height: widthPixel(72),
    borderRadius: widthPixel(36),
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: heightPixel(16),
  },
  iconImg: {
    width: widthPixel(70),
    height: widthPixel(70),
  },
  title: {
    marginBottom: heightPixel(10),
  },
  message: {
    marginBottom: heightPixel(8),
    lineHeight: 24,
  },
  cta: {
    minHeight: heightPixel(50),
    width: '100%',
    borderRadius: heightPixel(10),
    marginTop: heightPixel(8),
  },
});

const dynamicStyles = (colors: any, isDarkMode: boolean) => {
  const baseSheet = {
    backgroundColor: isDarkMode ? colors.black : '#FFFFFF',
    borderTopLeftRadius: heightPixel(16),
    borderTopRightRadius: heightPixel(16),
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(10),
    overflow: 'hidden' as const,
  };
  return StyleSheet.create({
    sheet: {
      ...baseSheet,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 12,
        },
        default: {},
      }),
    },
    grabber: {
      width: widthPixel(36),
      height: heightPixel(5),
      borderRadius: heightPixel(3),
      backgroundColor: isDarkMode ? '#3D3D3D' : '#D1D5DB',
      alignSelf: 'center',
      marginBottom: heightPixel(20),
    },
  });
};
