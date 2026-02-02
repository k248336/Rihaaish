import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import CustomText from './CustomText';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { colors, icons } from '../utilities';
import ZoomableImage from './ZoomableImage';
import useAppSelector from '../hooks/useAppSelector';
import FastImageComp from './FastImageComp';

type LocationHeaderProps = {
  title: string;
  locationText: string;
  locationicon: boolean;
  avatarSource: ImageSourcePropType;
  locationIconSource?: ImageSourcePropType;
  rightIconSource?: ImageSourcePropType;
  rightIconSource2?: ImageSourcePropType;
  onRightPress?: () => void;
  onRightPress2?: () => void;

  containerStyle?: ViewStyle;
};

const LocationHeader: React.FC<LocationHeaderProps> = ({
  title,
  locationText,
  avatarSource,
  locationIconSource = icons.locationIcon,
  rightIconSource = icons.notification,
  rightIconSource2 = icons.message,
  onRightPress2,
  onRightPress,
  containerStyle,
  locationicon,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { userInfo } = useAppSelector(state => state.auth);
  // console.log(userInfo.location, 'userInfouserInfo');

  const formatLocation = (location: string) => {
    if (!location) return '';

    const parts = location.split(',');

    if (parts[0].trim().match(/^[A-Z0-9+]+$/)) {
      parts.shift();
    }

    return parts.join(',').trim();
  };
  const truncateLocation = (location: string, limit = 20) => {
    if (!location) return '';
    return location.length > limit
      ? location.substring(0, limit) + '...'
      : location;
  };
  const cleanLocation = truncateLocation(formatLocation(userInfo.location), 29);
  console.log(cleanLocation, 'cleanlocationnnn');

  const getImageUri = (source: ImageSourcePropType): string => {
    if (typeof source === 'number') {
      const resolved = Image.resolveAssetSource(source);
      return resolved?.uri ?? '';
    }
    if (typeof source === 'object' && 'uri' in source) {
      return source.uri || '';
    }
    return '';
  };
  return (
    <View style={[styles.mainheader, containerStyle]}>
      <View style={[styles.flexrow, { gap: 15 }]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <FastImageComp
            source={userInfo?.image_url}
            style={styles.userimage}
          />
        </TouchableOpacity>

        <View style={{ gap: 2 }}>
          <CustomText
            color={colors.white}
            fontSize={heightPixel(16)}
            weight="bold"
          >
            {title}
          </CustomText>
          <View style={styles.flexrow}>
            {locationicon && (
              <Image
                tintColor={'rgba(91, 91, 91, 1)'}
                source={locationIconSource}
                style={styles.locationicon}
              />
            )}
            <CustomText
              color={'rgba(91, 91, 91, 1)'}
              weight="bold"
              fontSize={heightPixel(10)}
            >
              {cleanLocation || ''}
            </CustomText>
          </View>
        </View>
      </View>

      {rightIconSource ? (
        onRightPress ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={onRightPress2}
              activeOpacity={0.7}
            >
              <Image
                resizeMode="contain"
                style={styles.notificationicon}
                source={rightIconSource2}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              <Image
                resizeMode="contain"
                style={styles.notificationicon}
                source={rightIconSource}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.notificationContainer}>
            <Image style={styles.notificationicon} source={rightIconSource} />
          </View>
        )
      ) : (
        <View style={{ width: widthPixel(45) }} />
      )}
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <ZoomableImage source={userInfo.image_url} />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <CustomText weight="bold" fontSize={16} color="white">
              ✕
            </CustomText>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthPixel(10),
    // backgroundColor: colors.red,
    alignItems: 'center',
  },
  userimage: {
    height: heightPixel(50),
    width: widthPixel(50),
    borderRadius: heightPixel(50),
  },
  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  notificationContainer: {
    height: heightPixel(45),
    width: widthPixel(45),
    borderWidth: 1,
    borderColor: '#272835',
    borderRadius: heightPixel(50),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  locationicon: {
    height: heightPixel(14),
    width: widthPixel(10),
  },
  notificationicon: {
    height: heightPixel(21),
    width: widthPixel(15),
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
});

export default LocationHeader;
