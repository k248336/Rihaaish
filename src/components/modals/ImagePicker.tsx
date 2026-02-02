import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImagePicker,
  { Image as ImageType } from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {
  utility,
  deviceWidth,
  deviceHeight,
  icons,
  getAppStyles,
} from '../../utilities';
import CustomText from '../CustomText';
import { useTheme } from '../../hooks';
import Shadows from '../../utilities/Shadows';

interface ImagePickerModalProps {
  title?: string;
  visible: boolean;
  setVisible: () => void;
  multiple?: boolean;
  cropping?: boolean;
  onImageSelect: (image: ImageType | ImageType[]) => void;
  showGalleryBtn?: boolean;
  btnTitle?: string;
  [key: string]: any; // For other props passed to ImagePicker
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
      multiple: props.multiple,
      cropping: props.cropping,
      mediaType: props.mediaType || 'photo',
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: true,
      compressImageQuality: 0.7,
    })
      .then(images => {
        setVisible();
        onImageSelect(images);
      })
      .catch(err => {
        setVisible();
      });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      cropping: props.cropping,
      mediaType: props.mediaType || 'photo',
      cropperCircleOverlay: false,
      avoidEmptySpaceAroundImage: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        setVisible();
        onImageSelect(image);
      })
      .catch(err => {
        setVisible();
      });
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
      <View
        style={[dynamicStyles(colors).container, { backgroundColor: colors.white }]}
      >
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
            <CustomText weight='semibold' color={colors.white} style={dynamicStyles(colors).textStyle}>
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
              <CustomText
              weight='semibold'
                color={colors.white}
                style={dynamicStyles(colors).textStyle}
              >
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
    backgroundColor: colors.background,
  },
  handleStyle: {
    marginTop: 5,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 1,
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