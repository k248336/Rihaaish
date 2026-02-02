import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { colors, images } from '../utilities';
import CustomText from './CustomText';

interface EmptyCompProps {
  image?: any;
  title?: string;
  description?: string;
}

const EmptyComp: FC<EmptyCompProps> = ({ title, description }) => {
  return (
    <View style={styles.emptyContainer}>
      <Image
        resizeMode="contain"
        style={styles.emptyCompImg}
        source={images.noData}
      />

      <View style={styles.emptyCompTextContainer}>
        {title && (
          <CustomText
            fontSize={18}
            textAlignCenter
            weight="bold"
            color={colors.white}
            style={{ marginBottom: heightPixel(5) }}
          >
            {title}
          </CustomText>
        )}

        {description && (
          <CustomText
            fontSize={14}
            textAlignCenter
            weight="semibold"
            color={colors.white}
          >
            {description}
          </CustomText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  emptyCompImg: {
    width: widthPixel(300),
    height: heightPixel(300),
  },
  emptyCompTextContainer: {
    marginTop: heightPixel(-20),
    paddingHorizontal: widthPixel(10),
  },
});

export default EmptyComp;
