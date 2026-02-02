import React from 'react';
import {
  View,
  Image,
  TextInput,
  StyleProp,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../CustomButton';
import { font, heightPixel, widthPixel } from '../../utilities/helpers';
import {
  getAppStyles,
  getColors,
  deviceHeight,
  fontFamily,
  icons,
  getShadows,
} from '../../utilities';
import CustomText from '../CustomText';
import AnimatedCheckbox from '../AnimatedCheckbox';
import CustomTextInput from '../CustomTextInput';
import { useTheme } from '../../hooks';
import { useTranslation } from '../../utilities/translations';

interface AlertModalProps {
  title: string;
  subText?: string;
  checkboxlabel: string;
  visible: boolean;
  onConfirm: () => void;
  setVisible: () => void;
  showAlertBtn?: string;
  showCrossIcon?: boolean;
  value?: string;
  setValue?: (value: string) => void;
  titleSize?: number;
  titleStyle?: StyleProp<TextStyle>;
  confirmBtnTitle?: string;
  check: boolean;
  setCheck: (value: string) => void;
  cancelBtnTitle?: string;
  logoImage?: ImageSourcePropType;
  communityimage?: ImageSourcePropType;
  CommunityDetail?: any;
  backgroundcolor?: any;
  BookingRequest?: any;
  subTextBooking?: string;
  CommunityName?: string;
  CommunitySubstring?: string;
  CommunitySubtitle?: string;
  favourite?: boolean;
  Placeholder?: string;
  checkboxlabelpassword?: boolean;
}

export default function AlertModal(props: AlertModalProps) {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  const {
    title,
    subText,
    visible,
    onConfirm,
    CommunityName,
    CommunitySubstring,
    CommunitySubtitle,
    checkboxlabel,
    communityimage,
    check,
    setCheck,
    setVisible,
    showAlertBtn,
    showCrossIcon = false,
    CommunityDetail,
    BookingRequest,
    subTextBooking,
    setValue,
    value,
    titleSize,
    titleStyle,
    confirmBtnTitle,
    cancelBtnTitle,
    logoImage,
    favourite,
    Placeholder,
    checkboxlabelpassword,
    backgroundcolor,
  } = props;
  return (
    <Modal
      // useNativeDriver
      statusBarTranslucent
      isVisible={visible}
      backdropOpacity={0.8}
      backdropColor={'black'}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={dynamicStyles(colors).modalStyle}
      onBackdropPress={setVisible}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      deviceHeight={deviceHeight + deviceHeight}
      {...props}
    >
      <View
        style={[
          dynamicStyles(colors).container,
          {
            backgroundColor:
              BookingRequest == true ? colors.black : colors.white,
          },
        ]}
      >
        {showCrossIcon && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={setVisible}
            style={dynamicStyles(colors).crossIconView}
          >
            <Image
              resizeMode="contain"
              source={icons.cross}
              tintColor={colors.red}
              style={dynamicStyles(colors).crossIconStyle}
            />
          </TouchableOpacity>
        )}
        {logoImage && (
          <View
            style={{
              height: heightPixel(60),
              width: widthPixel(60),
              borderRadius: heightPixel(70),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: backgroundcolor,
              marginBottom: 10,
            }}
          >
            <Image
              resizeMode="contain"
              style={dynamicStyles(colors).imgStyle}
              tintColor={'red'}
              source={logoImage || icons.deleteicon}
            />
          </View>
        )}

        <CustomText
          color={BookingRequest == true ? colors.white : colors.black}
          style={[dynamicStyles(colors).textStyle, titleStyle]}
          fontSize={titleSize ?? 25}
          weight="semibold"
        >
          {t(title)}
        </CustomText>

        {subText && (
          <CustomText
            fontSize={14}
            color={colors.black}
            style={[dynamicStyles(colors).subTextStyle]}
          >
            {t(subText)}
          </CustomText>
        )}
        {checkboxlabel && (
          <AnimatedCheckbox
            size={20}
            checked={check}
            checkMarkColor={colors.white}
            onValueChange={setCheck}
            checkedBackgroundColor={colors.primary}
            checkboxContainerStyle={{
              padding: 0,
              marginRight: 8,
            }}
            containerStyle={dynamicStyles(colors).animatedCheckBoxContainer}
            labelStyle={{ color: colors.white }}
            label={
              <View style={{ alignItems: 'flex-start' }}>
                <CustomText fontSize={10} color={colors.black}>
                  {checkboxlabel}
                </CustomText>
              </View>
            }
          />
        )}
        {CommunityDetail && (
          <View
            style={[
              appStyles.flexRow,
              {
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: heightPixel(10),
                gap: widthPixel(10),
              },
            ]}
          >
            <Image
              source={communityimage}
              style={dynamicStyles(colors).communityimage}
            />
            <View style={{ gap: widthPixel(3) }}>
              <View style={[appStyles.flexRow, { gap: widthPixel(5) }]}>
                <CustomText fontSize={16} weight="bold" color={colors.primary}>
                  {CommunityName}
                </CustomText>
                <CustomText
                  fontSize={12}
                  weight="medium"
                  color={colors.greaytext}
                >
                  {CommunitySubstring}
                </CustomText>
              </View>
              <CustomText
                fontSize={12}
                weight="regular"
                color={colors.greaytext}
              >
                {CommunitySubtitle}
              </CustomText>
            </View>
          </View>
        )}

        {setValue && (
          <CustomTextInput
            containerStyle={dynamicStyles(colors).textInputContainer}
            allowFontScaling={false}
            passwordField
            placeholder={Placeholder}
            placeholderTextColor={colors.black}
            value={value}
            onChangeText={setValue}
          />
        )}
        {checkboxlabelpassword && (
          <AnimatedCheckbox
            size={20}
            checked={check}
            checkMarkColor={colors.white}
            onValueChange={setCheck}
            checkedBackgroundColor={colors.primary}
            checkboxContainerStyle={{
              padding: 0,
              marginRight: 8,
            }}
            containerStyle={dynamicStyles(colors).animatedCheckBoxContainer}
            labelStyle={{ color: colors.white }}
            label={
              <View style={{ alignItems: 'flex-start' }}>
                <CustomText fontSize={10} color={colors.black}>
                  {checkboxlabelpassword}
                </CustomText>
              </View>
            }
          />
        )}

        {showAlertBtn ? (
          <View style={dynamicStyles(colors).btnsView2}>
            <CustomButton
              txtSize={14}
              onPress={onConfirm}
              backgroundColor="#FF0B0F"
              title={showAlertBtn ? showAlertBtn : 'Go Back'}
              btnStyle={{ height: heightPixel(45) }}
            />
          </View>
        ) : (
          <View style={dynamicStyles(colors).btnsView}>
            <CustomButton
              txtSize={12}
              onPress={setVisible}
              backgroundColor={
                BookingRequest == true ? colors.red : colors.transparent
              }
              txtColor={BookingRequest == true ? colors.white : colors.black}
              btnStyle={dynamicStyles(colors).btnStyle2}
              title={cancelBtnTitle || 'No'}
            />

            <CustomButton
              txtSize={12}
              backgroundColor="red"
              title={confirmBtnTitle || 'Yes'}
              onPress={onConfirm}
              btnStyle={[dynamicStyles(colors).btnStyle]}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    modalStyle: {
      margin: 0,
    },
    communityimage: {
      height: heightPixel(55),
      width: widthPixel(55),
      resizeMode: 'contain',
    },
    container: {
      alignItems: 'center',
      borderRadius: heightPixel(30),
      paddingVertical: heightPixel(22),
      ...getShadows(false).shadow3,
      paddingHorizontal: widthPixel(16),
      marginHorizontal: widthPixel(20),
      backgroundColor: colors.white,
    },
    textStyle: {
      textAlign: 'center',
      marginHorizontal: widthPixel(50),
    },
    subTextStyle: {
      textAlign: 'center',
      marginTop: heightPixel(8),
      marginBottom: heightPixel(5),
    },
    animatedCheckBoxContainer: {
      marginTop: heightPixel(10),
    },
    btnsView: {
      paddingHorizontal: 5,
      flexDirection: 'row',
      gap: widthPixel(10),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    btnsView2: {},
    crossIconView: {
      alignSelf: 'flex-end',
      position: 'absolute',
      backgroundColor: colors.white,
      ...getShadows(false).shadow3,
      height: heightPixel(30),
      width: widthPixel(30),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
    },
    crossIconStyle: {
      width: widthPixel(10),
      height: heightPixel(10),
    },
    textInputContainer: {
      width: '100%',
      marginTop: heightPixel(10),
      height: heightPixel(50),
      fontSize: font(12),
      fontWeight: '400',
      color: colors.black,
    },
    imgStyle: {
      height: heightPixel(28),
      width: heightPixel(28),
    },
    btnStyle: {
      width: '48.5%',
      height: heightPixel(32),
    },
    btnStyle2: {
      width: '48.5%',
      height: heightPixel(32),
      borderWidth: 1,
      borderColor: colors.black,
    },
  });
