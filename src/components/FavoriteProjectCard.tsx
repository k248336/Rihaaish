import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import { getAppStyles, getShadows, icons } from '../utilities';
import { heightPixel, widthPixel } from '../utilities/helpers';
import GradientView from './GradientView';
import { useTheme } from '../hooks';

interface FavoriteProjectCardProps {
  item: {
    id: string;
    image: any;
    type: string;
    name: string;
    location: string;
    beds: number;
    baths: number;
    size: number;
    price: string;
  };
  onPressFavorite?: () => void;
  onPressCard?: () => void;
  onPressEdit?: () => void;
  onPressDelete?: () => void;

  isFavorite: boolean;
  listedProperty?: boolean;
}

const FavoriteProjectCard: React.FC<FavoriteProjectCardProps> = ({
  item,
  onPressFavorite,
  isFavorite,
  listedProperty,
  onPressEdit,
  onPressCard,
  onPressDelete,
}) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <TouchableOpacity
      onPress={onPressCard}
      activeOpacity={0.8}
      style={dynamicStyles(colors).cardContainer}
    >
      <ImageBackground
        borderRadius={20}
        source={item.image}
        style={dynamicStyles(colors).image}
      >
        <GradientView style={dynamicStyles(colors).typeTagContainer}>
          <CustomText fontSize={12} color="white">
            {item.type}
          </CustomText>
        </GradientView>
      </ImageBackground>

      <View style={dynamicStyles(colors).detailsContainer}>
        <View style={appStyles.flexRowBetween}>
          <View style={{ flex: 1 }}>
            <View style={appStyles.flexRowBetween}>
              <CustomText fontSize={16} weight="regular" color={colors.primary}>
                {item.name}
              </CustomText>
              {!listedProperty && (
                <TouchableOpacity activeOpacity={0.8} onPress={onPressFavorite}>
                  <Image
                    source={
                      isFavorite ? icons.favouritelogo : icons.unfavourite
                    }
                    style={dynamicStyles(colors).heartIcon}
                    // tintColor={isDarkMode ? colors.white : colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={dynamicStyles(colors).locationContainer}>
              <Image
                source={icons.location}
                style={dynamicStyles(colors).locationIcon}
              />
              <CustomText fontSize={10} color={colors.greaytext}>
                {item.location}
              </CustomText>
            </View>
          </View>
          {listedProperty && (
            <View style={{ gap: 5 }}>
              <TouchableOpacity
                style={dynamicStyles(colors).editview}
                activeOpacity={0.8}
                onPress={onPressEdit}
              >
                <Image
                  source={icons.edit}
                  style={dynamicStyles(colors).editicon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={dynamicStyles(colors).editview}
                activeOpacity={0.8}
                onPress={onPressDelete}
              >
                <Image
                  source={icons.deleteicon}
                  style={dynamicStyles(colors).editicon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={dynamicStyles(colors).infoRow}>
          <View style={dynamicStyles(colors).infoItem}>
            <Image source={icons.bed} style={dynamicStyles(colors).infoIcon} />
            <CustomText fontSize={12} weight="regular" color={colors.primary}>
              {item.beds}
            </CustomText>
          </View>
          <View style={dynamicStyles(colors).infoItem}>
            <Image
              source={icons.toilet}
              style={dynamicStyles(colors).infoIcon}
            />
            <CustomText fontSize={12} weight="regular" color={colors.primary}>
              {item.baths}
            </CustomText>
          </View>
          <View style={dynamicStyles(colors).infoItem}>
            <Image source={icons.size} style={dynamicStyles(colors).infoIcon} />
            <CustomText fontSize={12} weight="regular" color={colors.primary}>
              {item.size} Sqft
            </CustomText>
          </View>
        </View>

        <View style={appStyles.flexRowBetween}>
          <CustomText weight="medium" fontSize={16} color={colors.primary}>
            {item.price}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: heightPixel(20),
      overflow: 'hidden',
      marginBottom: heightPixel(15),
      elevation: 5,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    typeTagContainer: {
      backgroundColor: colors.purple2,
      borderRadius: heightPixel(20),
      height: heightPixel(21),
      paddingHorizontal: widthPixel(10),
      alignSelf: 'flex-start',
    },
    image: {
      width: widthPixel(116),
      height: heightPixel(108),
      margin: heightPixel(8),
      padding: 8,
    },
    detailsContainer: {
      flex: 1,
      padding: heightPixel(10),
      justifyContent: 'space-between',
    },
    typeText: {
      marginBottom: heightPixel(5),
    },
    editview: {
      backgroundColor: colors.lightgray, // Assuming a light gray from theme
      alignItems: 'center',
      justifyContent: 'center',
      height: heightPixel(24),
      width: widthPixel(24),
      borderRadius: heightPixel(30),
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: heightPixel(2),
    },
    locationIcon: {
      width: widthPixel(12),
      height: heightPixel(12),
      marginRight: widthPixel(5),
      tintColor: colors.greaytext,
    },
    heartIcon: {
      width: widthPixel(24),
      height: heightPixel(24),
      resizeMode: 'contain',
    },
    editicon: {
      width: widthPixel(12),
      height: heightPixel(12),
      // tintColor: colors.greaytext,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: heightPixel(0),
    },
    // infoItem: {
    //   flexDirection: 'row',
    //   borderRadius: heightPixel(10),
    //   alignItems: 'center',
    //   height: heightPixel(21),
    //   marginRight: widthPixel(5),
    //   paddingVertical: 5,
    //   padding: 8,
    //   backgroundColor: colors.whiteSmoke,
    // },

    infoItem: {
      flexDirection: 'row',
      borderRadius: heightPixel(10),
      alignItems: 'center',
      marginRight: widthPixel(5),
      ...getShadows(false).shadow3,
      padding: 4,
      backgroundColor: colors.whiteSmoke,
    },
    infoIcon: {
      width: widthPixel(12),
      height: heightPixel(12),
      marginRight: widthPixel(5),
    },
  });

export default FavoriteProjectCard;
