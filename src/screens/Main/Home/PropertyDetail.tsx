import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Share,
  Linking,
  ActivityIndicator,
  Modal,
  StatusBar,
  type ImageSourcePropType,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  BackButton,
  CustomButton,
  CustomScrollView,
  CustomText,
} from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  getAppStyles,
  getShadows,
  icons,
  images,
  utility,
} from '../../../utilities';
import { useAppDispatch, useTheme } from '../../../hooks';
import {
  fetchPropertyDetail,
  toggleFavoriteProperty,
} from '../../../redux/slices/property';
import { listPropertyImageUrls } from '../Profile/listedPropertyMapping';

const { width, height: windowHeight } = Dimensions.get('window');

const ImageZoomView = ImageZoom as React.ComponentType<
  React.ComponentProps<typeof ImageZoom> & { children?: React.ReactNode }
>;

interface SliderItem {
  id: string;
  type: 'image' | 'video';
  uri: any;
}

function sqftFromApi(size: unknown): number {
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }
  const digits = String(size ?? '').replace(/\D/g, '');
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(p: Record<string, unknown>): string {
  const rawPrice = p.price;
  const num =
    typeof rawPrice === 'number'
      ? rawPrice
      : parseFloat(String(rawPrice ?? '0'));
  return Number.isFinite(num)
    ? `Rs. ${num.toLocaleString()}`
    : String(rawPrice ?? '');
}

function buildSliderItems(
  property: Record<string, unknown> | null,
): SliderItem[] {
  if (!property) {
    return [{ id: '0', type: 'image', uri: images.recentprojects }];
  }
  const urls = listPropertyImageUrls(property);
  if (urls.length === 0) {
    return [{ id: '0', type: 'image', uri: images.recentprojects }];
  }
  return urls.map((url, i) => {
    const lower = url.toLowerCase();
    const isVideo =
      lower.endsWith('.mp4') ||
      lower.endsWith('.mov') ||
      lower.endsWith('.m3u8') ||
      lower.includes('/video');
    if (isVideo) {
      return { id: String(i), type: 'video' as const, uri: url };
    }
    return { id: String(i), type: 'image' as const, uri: { uri: url } };
  });
}

export default function PropertyDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const propertyId = String(route.params?.propertyId ?? route.params?.id ?? '');

  const [property, setProperty] = useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const flatListRef = useRef<FlatList<SliderItem>>(null);

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const insets = useSafeAreaInsets();

  const [imageViewerSource, setImageViewerSource] =
    useState<ImageSourcePropType | null>(null);

  const closeImageViewer = useCallback(() => {
    setImageViewerSource(null);
  }, []);

  const openImageViewer = useCallback((item: SliderItem) => {
    if (item.type !== 'image') {
      return;
    }
    setImageViewerSource(item.uri);
  }, []);

  const sliderItems = useMemo(() => buildSliderItems(property), [property]);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      utility.showAlertMessage('danger', 'Invalid property.');
      navigation.goBack();
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await dispatch(fetchPropertyDetail(propertyId)).unwrap();
        if (cancelled) {
          return;
        }
        setProperty(data);
        setIsFavorite(Boolean(data.is_favorite));
      } catch {
        if (!cancelled) {
          utility.showAlertMessage('danger', 'Could not load property.');
          navigation.goBack();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId, dispatch, navigation]);

  const handleToggleFavorite = useCallback(async () => {
    if (!propertyId) {
      return;
    }
    try {
      await dispatch(toggleFavoriteProperty(propertyId)).unwrap();
      const data = await dispatch(fetchPropertyDetail(propertyId)).unwrap();
      setProperty(data);
      setIsFavorite(Boolean(data.is_favorite));
    } catch {
      // checkError from postService
    }
  }, [dispatch, propertyId]);

  const openGoogleMaps = useCallback(() => {
    if (!property) {
      return;
    }
    const lat = Number(property.location_lat);
    const lng = Number(property.location_lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      utility.showAlertMessage('danger', 'Location coordinates not available.');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      utility.showAlertMessage('danger', 'Could not open Maps.');
    });
  }, [property]);

  const onShare = useCallback(async () => {
    if (!property) {
      return;
    }
    const title = String(property.title ?? 'Property');
    const price = formatPrice(property);
    const desc = String(property.description ?? '').slice(0, 400);
    try {
      await Share.share({
        message: `${title}\n${price}\n\n${desc}`,
      });
    } catch (error: any) {
      console.log('Error sharing:', error?.message);
    }
  }, [property]);

  const renderSliderItem = useCallback(
    ({ item, index }: { item: SliderItem; index: number }) => {
      const isVideoPlaying = item.type === 'video' && index === activeIndex;
      return (
        <View style={dynamicStyles(colors).video1}>
          {item.type === 'image' ? (
            <TouchableOpacity
              activeOpacity={0.95}
              style={dynamicStyles(colors).sliderImageTap}
              onPress={() => openImageViewer(item)}
            >
              <Image
                source={item.uri}
                style={dynamicStyles(colors).sliderImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
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
    },
    [activeIndex, colors, openImageViewer],
  );

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const Header = useCallback(() => {
    const isCurrentItemVideo = sliderItems[activeIndex]?.type === 'video';
    return (
      <View>
        <FlatList
          ref={flatListRef}
          data={sliderItems}
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
              onPress={handleToggleFavorite}
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
                  {activeIndex + 1}/{Math.max(sliderItems.length, 1)}
                </CustomText>
              </View>
            </ImageBackground>
          </View>
        )}
      </View>
    );
  }, [
    activeIndex,
    colors,
    isFavorite,
    sliderItems,
    onShare,
    handleToggleFavorite,
    renderSliderItem,
    appStyles.flexRow,
    appStyles.flexRowBetween,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: Header,
    });
  }, [navigation, Header]);

  const ownerEmail = useMemo(() => {
    const flat = String(property?.owner_email ?? '').trim();
    if (flat) {
      return flat;
    }
    const o = property?.owner as Record<string, unknown> | undefined;
    return String(o?.email ?? '').trim();
  }, [property]);

  const locationLine = useMemo(() => {
    if (!property) {
      return '';
    }
    const line1 = String(property.address ?? '').trim();
    const line2 = String(property.city ?? '').trim();
    return [line1, line2].filter(Boolean).join(', ') || line2 || line1 || '—';
  }, [property]);

  const title = property ? String(property.title ?? '—') : '…';
  const priceText = property ? formatPrice(property) : '…';
  const beds = property ? String(property.bedrooms ?? '0') : '…';
  const baths = property ? String(property.washrooms ?? '0') : '…';
  const sqft = property ? sqftFromApi(property.size) : 0;
  const description = property ? String(property.description ?? '—') : '';

  const contactOwner = () => {
    if (!ownerEmail) {
      utility.showAlertMessage('danger', 'Owner email is not available.');
      return;
    }
    utility.openMail(ownerEmail);
  };

  if (loading && !property) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.purple1} />
      </View>
    );
  }

  if (!property) {
    return null;
  }

  const imageViewerTopOffset = insets.top + 44;
  const imageViewerH = windowHeight - imageViewerTopOffset;
  const imageViewerW = width;

  return (
    <>
      <CustomScrollView
        contentStyle={{ paddingBottom: 0, marginTop: 0 }}
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <View style={[appStyles.flexRowBetween, { ...appStyles.MARGINTOP }]}>
          <CustomText fontSize={24} color={colors.primary} style={{ flex: 1 }}>
            {title}
          </CustomText>
          <CustomText fontSize={20} color={colors.purple1}>
            {priceText}
          </CustomText>
        </View>
        <View style={[appStyles.flexRow, { gap: 5 }]}>
          <Image
            source={icons.location}
            style={dynamicStyles(colors).locationicon}
            tintColor={colors.greaytext}
          />
          <CustomText
            fontSize={12}
            color={colors.greaytext}
            style={{ flex: 1 }}
          >
            {locationLine}
          </CustomText>
        </View>
        <View
          style={[
            appStyles.flexRowBetween,
            { ...appStyles.MARGINTOP, gap: 5, marginBottom: heightPixel(10) },
          ]}
        >
          <View style={dynamicStyles(colors).box}>
            <Image
              style={dynamicStyles(colors).houseicons}
              source={icons.bed}
            />
            <View>
              <CustomText weight="medium" fontSize={16} color={colors.primary}>
                {beds}
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
                {baths}
              </CustomText>
              <CustomText fontSize={12} color={colors.greaytext}>
                Washrooms
              </CustomText>
            </View>
          </View>
          <View style={dynamicStyles(colors).box}>
            <Image
              style={dynamicStyles(colors).houseicons}
              source={icons.size}
            />
            <View>
              <CustomText weight="medium" fontSize={16} color={colors.primary}>
                {sqft || '—'}
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
          {description}
        </CustomText>

        <CustomText
          style={{ marginTop: heightPixel(10) }}
          fontSize={16}
          weight="medium"
          color={colors.primary}
        >
          Location
        </CustomText>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openGoogleMaps}
          accessibilityRole="button"
          accessibilityLabel="Open in Google Maps"
        >
          <Image source={icons.map} style={dynamicStyles(colors).map} />
        </TouchableOpacity>
        <CustomButton
          gradient
          btnStyle={{ marginBottom: heightPixel(10) }}
          title="Contact Owner"
          onPress={contactOwner}
        />
      </CustomScrollView>
      <Modal
        visible={imageViewerSource != null}
        animationType="fade"
        transparent
        onRequestClose={closeImageViewer}
        statusBarTranslucent
      >
        <View style={staticStyles.imageViewerRoot}>
          {/* <StatusBar backgroundColor="black" barStyle="light-content" /> */}
        
            <TouchableOpacity
              onPress={closeImageViewer}
              hitSlop={{ top: 100, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              style={{
                position: 'absolute',
                top: 30,
                right: 20,
                zIndex: 1000,
                height:heightPixel(30),
                width:widthPixel(30),
                backgroundColor:colors.red,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius:heightPixel(15),
              }}
              accessibilityLabel="Close"
            >
              <Image
                source={icons.cross}
                style={staticStyles.imageViewerCloseIcon}
              />
            </TouchableOpacity>
          {imageViewerSource != null && (
            <View style={staticStyles.imageViewerZoomHost}>
              <ImageZoomView
                key={
                  typeof imageViewerSource === 'object' &&
                  imageViewerSource != null &&
                  'uri' in imageViewerSource
                    ? (imageViewerSource as { uri: string }).uri
                    : 'local'
                }
                cropWidth={imageViewerW}
                cropHeight={imageViewerH}
                imageWidth={imageViewerW}
                imageHeight={imageViewerH}
                minScale={1}
                maxScale={3}
                enableDoubleClickZoom
                pinchToZoom
                useNativeDriver
                enableSwipeDown
                onSwipeDown={closeImageViewer}
                style={staticStyles.imageViewerZoom}
              >
                <View
                  style={[
                    staticStyles.imageViewerInner,
                    { width: imageViewerW, height: imageViewerH },
                  ]}
                >
                  <Image
                    source={imageViewerSource}
                    style={[
                      staticStyles.imageViewerFull,
                      { width: imageViewerW, height: imageViewerH },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </ImageZoomView>
            </View>
          )}
        </View>
      </Modal>
    </>
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
    headerContent: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      zIndex: 1,
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
    sliderImageTap: {
      width: '100%',
      height: '100%',
    },
  });

const staticStyles = StyleSheet.create({
  imageViewerRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  imageViewerCloseIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  imageViewerZoomHost: {
    flex: 1,
  },
  imageViewerZoom: {
    flex: 1,
  },
  imageViewerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewerFull: {},
});
