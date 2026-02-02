import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedCheckboxProps } from '../interface';
import { useTheme } from '../hooks';

const AnimatedCheckbox: FC<AnimatedCheckboxProps> = ({
  label = 'Your label here',
  checked = false,
  touchableLabel = true,
  size = 20,
  checkPosition = 'left',
  checkedBackgroundColor = '#22cdf0',
  unCheckedBackgroundColor = 'white',
  unCheckedBorderColor = 'grey',
  checkedBorderColor = 'transparent',
  borderWidth = 1,
  rippleEffect = true,
  rippleColor = 'black',
  rounded = false,
  checkMarkSize = 12,
  checkMarkColor = 'black',
  animationType = 'scale',
  onValueChange,
  labelStyle,
  checkStyle,
  containerStyle,
  checkboxContainerStyle,
  labelContainerStyle,
  boxStyle,
  customMarker,
  checkBoxRadius,
}) => {
  const { colors, isDarkMode } = useTheme();

  const [isChecked, setIsChecked] = useState(checked);
  const animationScale = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const animationLeft = useRef(new Animated.Value(checked ? 0 : -size)).current;
  const animationReveal = useRef(
    new Animated.Value(checked ? size : 0),
  ).current;
  const rippleScale = useRef(new Animated.Value(0.01)).current;
  const rippleOpacity = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    setIsChecked(checked);
    if (animationType === 'scale') animateScale(!checked);
    else if (animationType === 'left') animateLeft(!checked);
    else animateReveal(!checked);
  }, [checked]);

  const handleValueChange = () => {
    const newValue = !isChecked;
    onValueChange(newValue);
    if (animationType === 'scale') animateScale(isChecked);
    else if (animationType === 'left') animateLeft(isChecked);
    else animateReveal(isChecked);
  };

  const animateScale = (currentChecked: boolean) => {
    if (currentChecked) {
      Animated.timing(animationScale, {
        toValue: 0.01,
        duration: 100,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationScale, {
        toValue: 1,
        easing: Easing.elastic(2),
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateLeft = (currentChecked: boolean) => {
    if (currentChecked) {
      Animated.timing(animationLeft, {
        toValue: -size,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationLeft, {
        toValue: 0,
        easing: Easing.elastic(1.2),
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateReveal = (currentChecked: boolean) => {
    if (currentChecked) {
      Animated.timing(animationReveal, {
        toValue: 0,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationReveal, {
        toValue: size,
        easing: Easing.ease,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const onPressedIn = () => {
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS === 'android',
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: Platform.OS === 'android',
      }),
    ]).start(() => {
      rippleScale.setValue(0.01);
      rippleOpacity.setValue(0.1);
    });
  };

  const renderTextBtn = (position: string) => {
    if (!label || position !== checkPosition) return null;

    return (
      <TouchableOpacity
        onPressIn={rippleEffect && touchableLabel ? onPressedIn : undefined}
        onPress={() => {
          if (touchableLabel) {
            setIsChecked(!isChecked);
            handleValueChange();
          }
        }}
        activeOpacity={touchableLabel ? 0.7 : 1}
        style={[{justifyContent: 'center', flex: 1}, labelContainerStyle]}>
        {React.isValidElement(label) ? (
          label
        ) : (
          <Text style={[{padding: 10}, labelStyle]}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderCheckBtn = () => {
    const animate =
      animationType === 'scale'
        ? {transform: [{scale: animationScale}]}
        : animationType === 'left'
        ? {transform: [{translateX: animationLeft}]}
        : {};

    return (
      <TouchableOpacity
        onPress={() => {
          setIsChecked(!isChecked);
          handleValueChange();
        }}
        activeOpacity={0.7}
        style={[{padding: 10}, checkboxContainerStyle]}>
        <Animated.View
          style={[
            {
              width: size,
              height: size,
              borderRadius: rounded ? size : checkBoxRadius || size * 0.2,
              borderWidth,
              borderColor: isChecked
                ? checkedBorderColor
                : unCheckedBorderColor,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: isChecked
                ? colors.black
                : unCheckedBackgroundColor,
            },
            boxStyle,
          ]}>
          {customMarker ? (
            <Animated.View style={animate}>{customMarker}</Animated.View>
          ) : (
            <Animated.Text
              style={[
                {
                  fontSize: checkMarkSize,
                  lineHeight: size,
                  color: checkMarkColor,
                },
                animate,
                checkStyle,
              ]}>
              ✓
            </Animated.Text>
          )}

          {animationType === 'reveal' && (
            <Animated.View
              style={{
                position: 'absolute',
                width: size,
                aspectRatio: 1,
                borderRadius: rounded ? size : size * 0.05,
                backgroundColor: isChecked
                  ? checkedBackgroundColor
                  : unCheckedBackgroundColor,
                transform: [{translateX: animationReveal}],
              }}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRipple = () => (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        transform: [{scale: rippleScale}],
        opacity: rippleOpacity,
        backgroundColor: rippleColor,
      }}
    />
  );

  return (
    <View
      style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}>
      {renderRipple()}
      {renderTextBtn('right')}
      {renderCheckBtn()}
      {renderTextBtn('left')}
    </View>
  );
};

export default AnimatedCheckbox;
