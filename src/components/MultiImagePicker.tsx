import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePickerModal from './modals/ImagePicker';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { getAppStyles, icons } from '../utilities';
import CustomText from './CustomText';
import FastImageComp from './FastImageComp';
import { useTheme } from '../hooks';

interface PickedImage {
  uri: string;
}

interface MultiImagePickerProps {
  images: PickedImage[];
  onChange: (imgs: PickedImage[]) => void;
  max?: number;
}

const MultiImagePicker: React.FC<MultiImagePickerProps> = ({
  images,
  onChange,
  max = 6,
}) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(v => !v);

  const handleSelect = (image: any) => {
    const incoming: PickedImage[] = Array?.isArray(image)
      ? image?.map((it: any) => ({ uri: it.path }))
      : image?.path
      ? [{ uri: image?.path }]
      : [];
    if (incoming.length === 0) return;
    const next = [...images, ...incoming].slice(0, max);
    onChange(next);
  };

  const removeAt = (index: number) => {
    const next = images?.filter((_, i) => i !== index);
    onChange(next);
  };
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <View>
      <View style={dynamicStyles(colors).grid}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[dynamicStyles(colors).tile, dynamicStyles(colors).uploadTile]}
          onPress={toggle}
        >
          <Image
            resizeMode="contain"
            source={icons.cloud}
            style={dynamicStyles(colors).uploadIcon}
          />
          <CustomText
            fontSize={heightPixel(10)}
            weight="medium"
            color={colors.purple1}
          >
            Upload Images
          </CustomText>
        </TouchableOpacity>
        {images?.map((img, idx) => (
          <View key={`${img.uri}-${idx}`} style={dynamicStyles(colors).tile}>
            <FastImageComp
              source={img.uri}
              style={dynamicStyles(colors).image}
            />
            <TouchableOpacity
              style={dynamicStyles(colors).remove}
              onPress={() => removeAt(idx)}
            >
              <Image
                tintColor={colors.red}
                source={icons.cross}
                style={{ width: 8, height: 8 }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <ImagePickerModal
        visible={visible}
        setVisible={toggle}
        multiple
        cropping={false}
        onImageSelect={handleSelect}
      />
    </View>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10 as unknown as number,
      marginTop: heightPixel(10),
    },
    tile: {
      width: widthPixel(107),
      height: widthPixel(100),
      borderRadius: 10,
      borderStyle: 'dashed',
      borderColor: colors.purple1,
      gap: 20,
      // overflow: 'hidden',
    },
    uploadTile: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.purple1,
    },
    uploadIcon: {
      width: 28,
      height: 28,
      tintColor: colors.purple1,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    remove: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 15,
      height: 15,
      borderRadius: 11,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default MultiImagePicker;
