import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { getAppStyles } from '../utilities/constants';
import CustomText from './CustomText';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { getShadows, icons } from '../utilities';
import GradientView from './GradientView';
import { useTheme } from '../hooks';

interface ProjectCardProps {
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
  isNewProject?: boolean;
  onPressFavorite?: () => void;
  onPressCard?: () => void;
  cardWidth?: number;
  isFavorite?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  isNewProject,
  onPressFavorite,
  cardWidth,
  isFavorite,
  onPressCard,
}) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  console.log(item, 'item111');

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPressCard}>
      <ImageBackground
        borderRadius={20}
        style={[
          dynamicStyles(colors).image,
          cardWidth ? { width: cardWidth } : {},
        ]}
        source={item.image}
      >
        <View style={dynamicStyles(colors).overlayContent}>
          <GradientView style={dynamicStyles(colors).typeTagContainer}>
            <CustomText fontSize={12} color="white">
              {item.type}
            </CustomText>
          </GradientView>
          <TouchableOpacity
            activeOpacity={0.8}
            style={dynamicStyles(colors).heartIconContainer}
            onPress={onPressFavorite}
          >
            <Image
              source={isFavorite ? icons.favouritelogo : icons.unfavourite}
              style={dynamicStyles(colors).heartIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={dynamicStyles(colors).detailsContainer}>
          <View
            style={[appStyles.flexRowBetween, { marginBottom: heightPixel(3) }]}
          >
            <View style={{ gap: heightPixel(2) }}>
              <CustomText color={colors.primary} fontSize={16} weight="regular">
                {item.name}
              </CustomText>
              <View style={dynamicStyles(colors).locationContainer}>
                <Image
                  source={icons.location}
                  style={dynamicStyles(colors).locationIcon}
                />
                <CustomText color={colors.primary} fontSize={10}>
                  {item.location?.slice(0, 30)}...
                </CustomText>
              </View>
            </View>

            <GradientView style={dynamicStyles(colors).arrowIconContainer}>
              <Image
                source={icons.arrowupright}
                style={dynamicStyles(colors).arrowIcon}
              />
            </GradientView>
          </View>
          <View style={dynamicStyles(colors).statsBlock}>
            <View style={dynamicStyles(colors).infoRow}>
              <View style={dynamicStyles(colors).infoItem}>
                <Image
                  source={icons.bed}
                  style={dynamicStyles(colors).infoIcon}
                />
                <CustomText
                  color={colors.primary}
                  fontSize={12}
                  weight="regular"
                >
                  {item.beds}
                </CustomText>
              </View>
              <View style={dynamicStyles(colors).infoItem}>
                <Image
                  source={icons.toilet}
                  style={dynamicStyles(colors).infoIcon}
                />
                <CustomText
                  color={colors.primary}
                  fontSize={12}
                  weight="regular"
                >
                  {item.baths}
                </CustomText>
              </View>
              <View style={dynamicStyles(colors).infoItem}>
                <Image
                  source={icons.size}
                  style={dynamicStyles(colors).infoIcon}
                />
                <CustomText
                  color={colors.primary}
                  fontSize={12}
                  weight="regular"
                >
                  {item.size} Sqft
                </CustomText>
              </View>
            </View>
            <CustomText
              style={dynamicStyles(colors).priceText}
              weight="medium"
              fontSize={16}
            >
              {item.price}
            </CustomText>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    cardContainer: {
      borderRadius: 20,
    },
    statsBlock: {
      marginTop: heightPixel(4),
    },
    image: {
      height: heightPixel(227),
      width: widthPixel(262),
      marginRight: widthPixel(15),
      borderRadius: heightPixel(100),
    },

    overlayContent: {
      // position: 'absolute',
      top: 10,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      flex: 1,
    },
    typeTagContainer: {
      backgroundColor: colors.purple2,
      borderRadius: heightPixel(20),
      height: heightPixel(21),
      paddingHorizontal: 10,
      // paddingVertical: 5,
    },
    typeTagText: {
      color: colors.white,
      fontSize: 12,
    },
    heartIconContainer: {
      borderRadius: 20,
    },
    heartIcon: {
      width: 30,
      height: 30,
    },
    detailsContainer: {
      backgroundColor: colors.white,
      // height: heightPixel(86),
      padding: heightPixel(10),
      marginHorizontal: 10,
      bottom: heightPixel(10),
      borderRadius: heightPixel(20),
    },
    nameText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colors.black,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 10,
    },
    locationIcon: {
      width: widthPixel(12),
      height: heightPixel(12),
      marginRight: 5,
      tintColor: '#858688',
    },
    locationText: {
      fontSize: 14,
      color: colors.gray,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: heightPixel(4),
      // marginBottom: 10,
      // position: 'relative',
    },
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
      width: 15,
      height: 15,
      marginRight: 5,
    },
    infoText: {
      fontSize: 14,
      color: colors.black,
    },
    arrowIconContainer: {
      borderRadius: heightPixel(20),
      width: widthPixel(30),
      height: heightPixel(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowIcon: {
      width: 20,
      height: 20,
    },
    priceText: {
      marginTop: heightPixel(10),
      color: colors.black,
    },
  });

export default ProjectCard;
