import React, { FC } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { getColors, getAppStyles, images } from '../utilities';
import { ICustomScrolllView } from '../interface';
import { useTheme } from '../hooks';

const CustomScrollView: FC<ICustomScrolllView> = props => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const {
    children,
    horizontal,
    isMarginTop,
    contentStyle,
    showBackground,
    backgroundStyle,
  } = props;

  return (
    <ImageBackground
      source={images.backgroundimage}
      style={[{ flex: 1 }, backgroundStyle]}
    >
      <KeyboardAwareScrollView
        bounces={false}
        horizontal={horizontal}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={[
          dynamicStyles(colors).scrollView,
          contentStyle,
          isMarginTop && !horizontal && appStyles.marginTop,
        ]}
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const dynamicStyles = (colors: any) => StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingTop: heightPixel(5),
    paddingBottom: heightPixel(120),
    paddingHorizontal: widthPixel(15),
    backgroundColor: colors.white,
  },
});

export default CustomScrollView;
