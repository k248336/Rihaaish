import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { colors, icons, images } from '../utilities';
import { IHeadingComp } from '../interface';
import CustomText from './CustomText';

const HeadingComp: FC<IHeadingComp> = props => {
  const {
    title,
    subTitle,
    layout,
    containerStyle,
    imagestyle,
    subTitleStyle,
    titleStyle,
    subTitleTxtSize,
    titleTxtSize,
    titleTxtColor,
    subTitleTxtColor,
    titletxtWeight,
    subTitleTxtWeight,
    highlitedText,
  } = props;

  return (
    <>
      {layout == 'first' ? (
        <View style={[styles.container, containerStyle]}>
          <Image
            resizeMode="contain"
            source={icons.logo}
            style={imagestyle || styles.appLogoStyle}
          />

          <CustomText
            fontSize={titleTxtSize ?? 14}
            color={titleTxtColor ?? colors.white}
            style={{ marginBottom: heightPixel(1) }}
            weight={titletxtWeight ?? 'regular'}
          >
            {title}
          </CustomText>

          {subTitle && (
            <CustomText
              color={subTitleTxtColor ?? colors.secondary}
              fontSize={subTitleTxtSize ?? 26}
              weight={subTitleTxtWeight ?? 'semibold'}
              textAlignCenter
            >
              {subTitle}
            </CustomText>
          )}
        </View>
      ) : (
        <View style={[containerStyle]}>
          <CustomText
            fontSize={titleTxtSize ?? 14}
            color={titleTxtColor ?? colors.gray}
            style={titleStyle}
            weight={titletxtWeight ?? 'regular'}
          >
            {title}
          </CustomText>

          {subTitle && (
            <CustomText
              color={subTitleTxtColor ?? colors.secondary}
              fontSize={subTitleTxtSize ?? 24}
              weight={subTitleTxtWeight ?? 'semibold'}
              style={subTitleStyle}
            >
              {subTitle}
              {highlitedText && (
                <CustomText
                  color={colors.highlightedTxt}
                  fontSize={subTitleTxtSize ?? 24}
                  weight={subTitleTxtWeight ?? 'semibold'}
                >
                  {highlitedText}
                </CustomText>
              )}
            </CustomText>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  appLogoStyle: {
    // alignSelf: 'center',
    width: heightPixel(44),
    height: heightPixel(39),
    // marginBottom: heightPixel(20),
  },
  flexRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HeadingComp;
