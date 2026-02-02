import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Animated,
  TextInput,
  StyleSheet,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import CustomText from './CustomText';
import { CustomTextInputProps } from '../interface';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { fontFamily, getAppStyles, getShadows, icons } from '../utilities';
import { useTheme } from '../hooks';

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (props, ref) => {
    const {
      icon,
      label,
      multiline,
      passwordField,
      containerStyle,
      inputFieldStyle,
      placeholderTextColor,
      rightIconColor,
      iconcolor,
      rightIconSize,
      rightIcon,
      headingLabel,
      onPressIn,
      errors,
      focus,
    } = props;
    const { colors, isDarkMode } = useTheme();
    const appStyles = getAppStyles(isDarkMode);

    const [focused, setFocused] = useState<boolean>(false);
    const [secureText, setSecureText] = useState<boolean>(true);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
      if (errors) {
        Animated.spring(slideAnim, {
          toValue: 0,
          // friction: 8,
          // tension: 40,
          useNativeDriver: true,
        }).start();
      }
    }, [errors]);

    return (
      <View>
        {label && (
          <CustomText
            fontSize={12}
            weight="semibold"
            color={colors.black}
            style={{ marginTop: 10, marginBottom: -8, marginLeft: 10 }}
          >
            {label}
          </CustomText>
        )}
        {headingLabel && (
          <CustomText
            fontSize={12}
            weight="bold"
            color={colors.black}
            style={{ marginTop: 10, marginBottom: -8, marginLeft: 10 }}
          >
            {headingLabel}
          </CustomText>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!onPressIn}
          onPress={onPressIn}
          style={[
            dynamicStyles(colors).container,
            containerStyle,
            { borderWidth: focused ? 1 : 0 },
          ]}
        >
          {icon && (
            <View style={dynamicStyles(colors).iconView}>
              <Image
                source={icon}
                resizeMode="contain"
                tintColor={iconcolor}
                style={[
                  dynamicStyles(colors).iconStyle,
                  {
                    width: rightIconSize || 15,
                    height: rightIconSize || 15,
                  },
                ]}
              />
            </View>
          )}

          <TextInput
            {...props}
            ref={ref}
            multiline={multiline}
            cursorColor={colors.black}
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : colors.gray + '99'
            }
            secureTextEntry={passwordField ? secureText : false}
            style={[
              dynamicStyles(colors).textInputStyle,
              multiline && {
                height: 150,
                textAlignVertical: 'top',
                paddingTop: heightPixel(10),
              },
              inputFieldStyle,
            ]}
          />

          {passwordField && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={dynamicStyles(colors).iconView}
              onPress={() => setSecureText(!secureText)}
            >
              <Image
                resizeMode="contain"
                source={secureText ? icons.eyeClose : icons.eyeOpen}
                style={[
                  dynamicStyles(colors).iconStyle,
                  { tintColor: colors.gray },
                ]}
              />
            </TouchableOpacity>
          )}

          {rightIcon && (
            <Image
              resizeMode="contain"
              source={rightIcon}
              tintColor={rightIconColor}
              style={{
                marginRight: 5,
                width: rightIconSize || 10,
                height: rightIconSize || 10,
              }}
            />
          )}
        </TouchableOpacity>

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
  },
);

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 5,
      marginTop: 15,
      ...getShadows(false).shadow3,
      borderRadius: 30,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth: 1,
      borderColor: '#EDF1F3',

      backgroundColor: colors.white,
    },
    iconView: {
      flex: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconStyle: {
      width: 15,
      height: 15,
    } as ImageStyle,
    textInputStyle: {
      flex: 1,
      height: 45,

      padding: 0,
      marginHorizontal: 8,
      color: colors.black,
      // fontFamily:,
      // fontWeight: '600',
    },
  });

export default CustomTextInput;
