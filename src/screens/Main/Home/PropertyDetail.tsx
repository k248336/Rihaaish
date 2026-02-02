import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  ViewToken,
  Share,
} from 'react-native';
import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import Video from 'react-native-video';
import type { VideoRef } from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  BackButton,
  CustomButton,
  CustomScrollView,
  CustomText,
  WelcomeHeader,
} from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  getAppStyles,
  getShadows,
  icons,
  images,
  utility,
} from '../../../utilities';
import { useTheme } from '../../../hooks';

const { width } = Dimensions.get('window');

interface SliderItem {
  id: string;
  type: 'image' | 'video';
  uri: any;
}

const sliderData: SliderItem[] = [
  {
    id: '1',
    type: 'image',
    uri: images.recentprojects1,
  },
  {
    id: '2',
    type: 'video',
    uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  },
  {
    id: '3',
    type: 'image',
    uri: images.recentprojects3,
  },
];

export default function PropertyDetail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const flatListRef = useRef<FlatList<SliderItem>>(null);
  const videoRefs = useRef<Record<string, VideoRef | null>>({});

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const renderSliderItem = ({
    item,
    index,
  }: {
    item: SliderItem;
    index: number;
  }) => {
    const isVideoPlaying = item.type === 'video' && index === activeIndex;
    return (
      <View style={dynamicStyles(colors).video1}>
        {item.type === 'image' ? (
          <Image
            source={item.uri}
            style={dynamicStyles(colors).sliderImage}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={dynamicStyles(colors).videoContainer}
          >
            <Video
              source={{ uri: item.uri }}
              style={dynamicStyles(colors).video}
              resizeMode="cover"
              controls
              paused={!isVideoPlaying}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const Header = useCallback(() => {
    const isCurrentItemVideo = sliderData[activeIndex]?.type === 'video';
    return (
      <View>
        <FlatList
          ref={flatListRef}
          data={sliderData}
          renderItem={renderSliderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          style={dynamicStyles(colors).sliderFlatlist}
        />

        <View
          style={[
            appStyles.flexRowBetween,
            dynamicStyles(colors).headerContent,
            { marginTop: heightPixel(20) },
          ]}
        >
          <BackButton style={{}} />
          <View style={[appStyles.flexRow, { gap: widthPixel(10) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsFavorite(prev => !prev)}
              style={{ zIndex: 999 }}
            >
              <Image
                style={dynamicStyles(colors).icon}
                source={isFavorite ? icons.favouritelogo : icons.unheart}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={onShare}>
              <Image style={dynamicStyles(colors).icon} source={icons.share} />
            </TouchableOpacity>
          </View>
        </View>
        {!isCurrentItemVideo && (
          <View
            style={[
              appStyles.flexRowBetween,
              dynamicStyles(colors).headerContent,
              { marginTop: heightPixel(0), bottom: 0 },
            ]}
          >
            <Image style={dynamicStyles(colors).icon} source={icons.play} />
            <ImageBackground
              resizeMode="contain"
              style={dynamicStyles(colors).boxBackground}
              source={icons.box}
            >
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Image
                  style={dynamicStyles(colors).albumIcon}
                  source={icons.album}
                />
                <CustomText color="white">
                  {activeIndex + 1}/{sliderData.length}
                </CustomText>
              </View>
            </ImageBackground>
          </View>
        )}
      </View>
    );
  }, [activeIndex, colors, isFavorite]);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out this property: Coral Bay for $200k. Description: Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de.',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.log('Error sharing:', error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: Header,
    });
  }, [navigation, Header]);

  return (
    <CustomScrollView
      contentStyle={{ paddingBottom: 0, marginTop: 0 }}
      backgroundStyle={{ backgroundColor: colors.background }}
    >
      <View style={[appStyles.flexRowBetween, { ...appStyles.MARGINTOP }]}>
        <CustomText fontSize={24} color={colors.primary}>
          Coral Bay
        </CustomText>
        <CustomText fontSize={20} color={colors.purple1}>
          $200k
        </CustomText>
      </View>
      <View style={[appStyles.flexRow, { gap: 5 }]}>
        <Image
          source={icons.location}
          style={dynamicStyles(colors).locationicon}
          tintColor={colors.greaytext}
        />
        <CustomText fontSize={12} color={colors.greaytext}>
          3245 skylew lane, LA 8979
        </CustomText>
      </View>
      <View
        style={[
          appStyles.flexRowBetween,
          { ...appStyles.MARGINTOP, gap: 5, marginBottom: heightPixel(10) },
        ]}
      >
        <View style={dynamicStyles(colors).box}>
          <Image style={dynamicStyles(colors).houseicons} source={icons.bed} />
          <View>
            <CustomText weight="medium" fontSize={16} color={colors.primary}>
              3
            </CustomText>
            <CustomText fontSize={12} color={colors.greaytext}>
              Bedrooms
            </CustomText>
          </View>
        </View>
        <View style={dynamicStyles(colors).box}>
          <Image
            style={dynamicStyles(colors).houseicons}
            source={icons.toilet}
          />
          <View>
            <CustomText weight="medium" fontSize={16} color={colors.primary}>
              3
            </CustomText>
            <CustomText fontSize={12} color={colors.greaytext}>
              Washrooms
            </CustomText>
          </View>
        </View>
        <View style={dynamicStyles(colors).box}>
          <Image style={dynamicStyles(colors).houseicons} source={icons.size} />
          <View>
            <CustomText weight="medium" fontSize={16} color={colors.primary}>
              1260
            </CustomText>
            <CustomText fontSize={12} color={colors.greaytext}>
              Sqft
            </CustomText>
          </View>
        </View>
      </View>
      <CustomText fontSize={16} weight="medium" color={colors.primary}>
        Description
      </CustomText>
      <CustomText
        style={dynamicStyles(colors).description}
        fontSize={12}
        weight="regular"
        color={colors.greaytext}
      >
        Lorem Ipsum es simplemente el texto de relleno de las imprentas y
        archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de
        las industrias desde el año 1500, cuando un impresor (N. del T. Lorem
        Ipsum es simplemente el texto de relleno de las imprentas y archivos de
        texto. Lorem Ipsum ha sido el texto de relleno estándar de.
      </CustomText>

      <CustomText
        style={{ marginTop: heightPixel(10) }}
        fontSize={16}
        weight="medium"
        color={colors.primary}
      >
        Location
      </CustomText>
      <Image source={icons.map} style={dynamicStyles(colors).map} />
      <CustomButton
        gradient
        title="Contact Owner"
        onPress={() => {
          utility.openDialer('+923223525116');
        }}
      />
    </CustomScrollView>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    icon: {
      height: heightPixel(40),
      width: widthPixel(40),
      resizeMode: 'contain',
    },
    video1: { width: width, height: heightPixel(340) },
    description: {
      marginTop: heightPixel(5),
      letterSpacing: 0.5,
      lineHeight: 18,
    },
    map: {
      height: heightPixel(185),
      width: widthPixel(353),
      resizeMode: 'contain',
      ...getShadows(false).shadow5,
      marginTop: heightPixel(5),
    },
    houseicons: {
      height: heightPixel(15),
      width: widthPixel(15),
      resizeMode: 'contain',
    },

    box: {
      height: heightPixel(90),
      backgroundColor: colors.halfWhite,
      ...getShadows(false).shadow3,
      gap: heightPixel(15),
      borderRadius: heightPixel(10),
      padding: heightPixel(12),

      width: widthPixel(110.97),
    },
    locationicon: {
      height: heightPixel(12),
      width: widthPixel(12),
      resizeMode: 'contain',
      tintColor: '#858688',
    },
    sliderFlatlist: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      // overflow: 'hidden',
    },
    sliderImage: {
      width: '100%',
      height: '100%',
    },
    videoContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      height: '100%',
      right: 0,
    },
    playButtonOverlay: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playButton: {
      width: widthPixel(60),
      height: widthPixel(60),
      tintColor: 'white',
    },
    headerContent: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      zIndex: 1,
    },
    paginationContainer: {
      position: 'absolute',
      bottom: heightPixel(10),
      alignSelf: 'center',
      flexDirection: 'row',
      zIndex: 1,
    },
    paginationDot: {
      width: widthPixel(8),
      height: widthPixel(8),
      borderRadius: widthPixel(4),
      backgroundColor: 'rgba(255,255,255,0.5)',
      marginHorizontal: widthPixel(4),
    },
    paginationDotActive: {
      backgroundColor: 'white',
    },
    boxBackground: {
      height: 50,
      width: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    albumIcon: {
      height: 16,
      width: 16,
      resizeMode: 'contain',
    },
  });
