import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePicker,
  { Image as ImageType } from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import CustomText from '../CustomText';
import {
  icons,
  utility,
  getAppStyles,
  deviceWidth,
  deviceHeight,
} from '../../utilities';
import { useTheme } from '../../hooks';

interface ImagePickerModalProps {
  title?: string;
  visible: boolean;
  setVisible: () => void;
  multiple?: boolean;
  cropping?: boolean;
  onImageSelect: (image: ImageType | ImageType[]) => void;
  showGalleryBtn?: boolean;
  btnTitle?: string;
  [key: string]: any;
}

export default function ImagePickerModal(props: ImagePickerModalProps) {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const {
    title,
    visible,
    setVisible,
    multiple,
    cropping,
    onImageSelect,
    showGalleryBtn = true,
    btnTitle = 'Camera',
  } = props;

  const openGallery = () => {
    ImagePicker.openPicker({
      ...props,
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: true,
      compressImageQuality: 0.7,
    })
      .then(async images => {
        setVisible();
        onImageSelect(images);
      })
      .catch(err => console.log(err));
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      ...props,
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        setVisible();
        onImageSelect(image);
      })
      .catch(err => console.log(err));
  };

  return (
    <Modal
      useNativeDriver
      statusBarTranslucent
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={dynamicStyles(colors).modalStyle}
      onBackdropPress={setVisible}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      deviceHeight={deviceHeight + deviceHeight}
    >
      <View style={dynamicStyles(colors).container}>
        {title && <CustomText style={dynamicStyles(colors).titleStyle} color={colors.primary}>{title}</CustomText>}

        <View
          style={[
            dynamicStyles(colors).flexRow,
            !showGalleryBtn && { justifyContent: 'space-evenly' },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openCamera}
            style={[dynamicStyles(colors).cardStyle, appStyles.shadow]}
          >
            <Image
              resizeMode="contain"
              style={dynamicStyles(colors).iconStyle}
              source={icons.cameraIcon2}
            />
            <CustomText style={dynamicStyles(colors).textStyle} weight='semibold' color={colors.white}>
              {btnTitle}
            </CustomText>
          </TouchableOpacity>

          {showGalleryBtn && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openGallery}
              style={[dynamicStyles(colors).cardStyle, appStyles.shadow]}
            >
              <Image
                resizeMode="contain"
                style={dynamicStyles(colors).iconStyle}
                source={icons.galleryIcon}
              />
              <CustomText style={dynamicStyles(colors).textStyle} weight='semibold' color={colors.white}>
                Gallery
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  handleStyle: {
    marginTop: 5,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    paddingBottom: utility.isPlatformIOS ? 45 : 30,
  },
  flexRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStyle: {
    height: 120,
    borderRadius: 10,
    width: deviceWidth / 2.3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple1,
  },
  iconStyle: {
    width: 45,
    height: 45,
    tintColor: colors.white,
  },
  textStyle: {
    marginTop: 5,
    color: colors.white,
  },
  titleStyle: {
    marginBottom: 10,
    color: colors.primary,
    textAlign: 'center',
  },
});