import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { getAppStyles, getShadows, images } from '../utilities';
import { IPhoneTextInput } from '../interface';
import { heightPixel, widthPixel } from '../utilities/helpers';
import CustomText from './CustomText';
import { useTheme } from '../hooks';

const PhoneTextInput: FC<IPhoneTextInput> = forwardRef((props, ref) => {
  const { icon, value, setValue, placeholder, errors, focus } = props;
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (errors) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [errors]);

  const onSelect = (val: string) => {
    console.log('onSelect: ', val);
  };

  return (
    <View style={{ flex: 0 }}>
      <View style={[dynamicStyles(colors).container]}>
        <View style={dynamicStyles(colors).iconView}>
          <Image
            source={icon}
            resizeMode="contain"
            style={[
              dynamicStyles(colors).iconStyle,
              { tintColor: focused ? colors.white : colors.gray },
            ]}
          />
        </View>

        <PhoneInput
          defaultCode="US"
          defaultValue={value}
          placeholder={placeholder}
          onChangeFormattedText={setValue}
          textInputProps={{
            maxLength: 10,
            editable: true,
            cursorColor: colors.gray,
            onBlur: () => setFocused(false),
            onFocus: () => setFocused(true),
            placeholderTextColor: colors.gray + 99,
          }}
          codeTextStyle={[{ color: colors.gray }]}
          containerStyle={dynamicStyles(colors).phoneInputContainer}
          countryPickerButtonStyle={{ width: undefined }}
          textContainerStyle={dynamicStyles(colors).textContainerStyle}
          textInputStyle={[dynamicStyles(colors).textInputStyle]}

          // renderDropdownImage={
          //   <Image
          //     resizeMode="contain"
          //     source={images.arrowDown}
          //     style={styles.arrowIconStyle}
          //   />
          // }
        />

        <View style={dynamicStyles(colors).iconView} />
      </View>
      {errors && focus && (
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <CustomText
            fontSize={12}
            color={colors.danger}
            style={{ marginTop: heightPixel(5), marginLeft: widthPixel(8) }}
          >
            {errors}
          </CustomText>
        </Animated.View>
      )}
    </View>
  );
});

export default PhoneTextInput;

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginTop: 15,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#EDF1F3',
      ...getShadows(false).shadow5,
      // borderWidth: 1,
      backgroundColor: colors.white,
    },
    phoneInputContainer: {
      flex: 1,
      height: 50,
      // marginHorizontal: 8,
      backgroundColor: colors.transparent,
    },
    textInputStyle: {
      height: 50,
      padding: 0,
      color: colors.black,
    },
    textContainerStyle: {
      height: 50,
      paddingHorizontal: 12,
      backgroundColor: colors.transparent,
      paddingVertical: 0,
    },
    iconView: {
      // flex: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconStyle: {
      width: 22,
      height: 22,
    },
    arrowIconStyle: {
      width: 10,
      height: 10,
    },
  });
