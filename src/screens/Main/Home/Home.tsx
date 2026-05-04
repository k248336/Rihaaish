import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  CustomButton,
  CustomScrollView,
  CustomText,
  GradientView,
  HorizontalTabs,
  SearchBar,
  WelcomeHeader,
} from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getAppStyles,
  icons,
  images,
  navigate,
  screens,
} from '../../../utilities';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import LinearGradient from 'react-native-linear-gradient';
import ProjectCard from '../../../components/ProjectCard'; // Corrected import path
import { useAppDispatch, useAppSelector, useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import {
  fetchAllProperties,
  toggleFavoriteProperty,
} from '../../../redux/slices/property';
import {
  toListedPropertyCard,
  type ListedPropertyCard,
} from '../Profile/listedPropertyMapping';
import { hideLoader, showLoader } from '../../../redux/slices';

type HomePropertyItem = ListedPropertyCard & { isFavorite: boolean };

function mapApiToHomeItem(p: Record<string, unknown>): HomePropertyItem {
  return {
    ...toListedPropertyCard(p),
    isFavorite: Boolean(p.is_favorite),
  };
}

const HOME_PREVIEW_COUNT = 2;

export default function Home() {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(s => s.auth);

  const [properties, setProperties] = useState<HomePropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = useCallback(async () => {
    dispatch(showLoader());
    try {
      const raw = await dispatch(fetchAllProperties()).unwrap();
      setProperties(
        (raw as Record<string, unknown>[]).map(mapApiToHomeItem),
      );
    } catch {
      setProperties([]);
    } finally {
      dispatch(hideLoader());
    }
  }, [dispatch]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const newProjectsPreview = useMemo(
    () => properties.slice(0, HOME_PREVIEW_COUNT),
    [properties],
  );

  const recentProjectsPreview = useMemo(
    () => properties.slice(0, HOME_PREVIEW_COUNT),
    [properties],
  );

  const welcomeName = useMemo(() => {
    const f = userInfo.firstname?.trim();
    const l = userInfo.lastname?.trim();
    if (f || l) {
      return [f, l].filter(Boolean).join(' ');
    }
    if (userInfo.email) {
      return userInfo.email.split('@')[0] || userInfo.email;
    }
    return 'Guest';
  }, [userInfo.firstname, userInfo.lastname, userInfo.email]);

  const Header = ({ insets }: { insets: any }) => {
    return (
      <WelcomeHeader
        containerStyle={{
          paddingTop: insets.top || heightPixel(5),
        }}
        name={welcomeName}
        profile={userInfo.image_url ? userInfo.image_url : undefined}
      />
    );
  };
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <Header insets={insets} />;
      },
    });
  }, [insets, navigation, welcomeName, userInfo.image_url]);

  const handleFavouritePress = async (itemId: string) => {
    try {
      await dispatch(toggleFavoriteProperty(itemId)).unwrap();
      await loadProperties();
    } catch {
      // postService surfaces errors via checkError
    }
  };
  return (
    <View style={[appStyles.container]}>
      <CustomScrollView>
        <LinearGradient
          colors={['#776CF8', '#3F12A5']}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 0.8, y: 0.5 }}
          style={dynamicStyles(colors).gradient}
        >
          <View style={dynamicStyles(colors).gradientview}>
            <View style={{ left: 20 }}>
              <CustomText fontSize={28} weight="regular" color="white">
                {t('FindYour')}
              </CustomText>
              <CustomText fontSize={28} weight="bold" color="white">
                {t('DreamHouse')}
              </CustomText>
              <CustomText fontSize={12} weight="regular" color="white">
                {t('yourDream')}
              </CustomText>

              <CustomButton
                txtSize={10}
                txtColor={colors.black}
                btnStyle={dynamicStyles(colors).button}
                onPress={() => {
                  ('');
                }}
                title={t('clicknow')}
              />
              <Image source={icons.hand} style={dynamicStyles(colors).hand} />
            </View>
            <View style={dynamicStyles(colors).template}>
              <Image
                source={images.template}
                style={{ height: '100%', width: '100%' }}
              />
            </View>
          </View>
        </LinearGradient>
        <CustomText weight="regular" fontSize={20} color={colors.primary}>
          {t('Everysoulcarrieshiddenstories')}
        </CustomText>
        <View style={[appStyles.flexRowBetween, { gap: 0 }]}>
          <SearchBar
            filter
            containerStyle={dynamicStyles(colors).searchbar}
            placeholder={t('searchyourplaces')}
          />
          <GradientView style={dynamicStyles(colors).filterview}>
            <Image
              source={icons.filter}
              style={dynamicStyles(colors).filtericon}
            />
          </GradientView>
        </View>
        <HorizontalTabs
          tabs={[
            { label: t('All') },
            { label: t('Appartment'), image: icons.appartment },
            { label: t('Villas'), image: icons.villas },
            { label: t('Resorts'), image: icons.resorts },
          ]}
          onPressTab={selectedTabs => console.log(selectedTabs)}
        />

        {loading && properties.length === 0 ? (
          <View style={dynamicStyles(colors).homeLoading}>
            <ActivityIndicator size="large" color={colors.purple1} />
          </View>
        ) : null}

        <View
          style={[
            dynamicStyles(colors).sectionHeader,
            { marginTop: heightPixel(10) },
          ]}
        >
          <View style={dynamicStyles(colors).sectionHeaderMain}>
            <CustomText fontSize={20} color={colors.primary}>
              {t('NewProjects')}
            </CustomText>
            <TouchableOpacity
              onPress={() => {
                navigate(screens.NewProjects);
              }}
              activeOpacity={0.8}
            >
              <CustomText
                fontSize={12}
                weight="bold"
                color={colors.purple1}
                style={dynamicStyles(colors).viewAllText}
              >
                {t('ViewAll')}
              </CustomText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={newProjectsPreview}
            ListEmptyComponent={
              !loading ? (
                <CustomText fontSize={12} color={colors.greaytext}>
                  No properties yet.
                </CustomText>
              ) : null
            }
            renderItem={({ item }) => (
              <ProjectCard
                onPressCard={() =>
                  navigate(screens.PropertyDetail, { propertyId: item.id })
                }
                item={item}
                onPressFavorite={() => handleFavouritePress(item.id)}
                isFavorite={item.isFavorite}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={dynamicStyles(colors).newProjectsList}
          />
        </View>

        <View
          style={[
            dynamicStyles(colors).sectionHeaderMain,
            { marginBottom: 0, marginTop: heightPixel(10) },
          ]}
        >
          <CustomText weight="regular" fontSize={20} color={colors.primary}>
            {t('RecentProjects')}
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigate(screens.NewProjects)}
          >
            <CustomText
              weight="bold"
              fontSize={12}
              color={colors.purple1}
              style={dynamicStyles(colors).viewAllText}
            >
              {t('ViewAll')}
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={dynamicStyles(colors).recentProjectsContainer}>
          {properties.length === 0 && !loading ? (
            <CustomText fontSize={12} color={colors.greaytext}>
              No properties yet.
            </CustomText>
          ) : (
            recentProjectsPreview.map(item => (
              <ProjectCard
                key={item.id}
                item={item}
                onPressCard={() =>
                  navigate(screens.PropertyDetail, { propertyId: item.id })
                }
                onPressFavorite={() => handleFavouritePress(item.id)}
                cardWidth={widthPixel(345)}
                isFavorite={item.isFavorite}
              />
            ))
          )}
        </View>
      </CustomScrollView>
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    gradientview: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filtericon: {
      width: 16,
      height: 16,
      // tintColor: colors.white,
      resizeMode: 'contain',
    },
    filterview: {
      width: widthPixel(40),
      height: heightPixel(40),
      borderRadius: 100,
    },
    searchbar: {
      width: widthPixel(290),
      borderRadius: 100,
      backgroundColor: colors.white,
      // ...Shadows.shadow3,
      marginTop: heightPixel(10),
    },
    hand: {
      height: 30,
      width: 30,
      position: 'absolute',
      bottom: -10,
      left: 50,
    },
    template: {
      top: 15,
      left: 4,
      width: widthPixel(151),
      height: heightPixel(100),
    },
    button: {
      width: widthPixel(70),
      height: heightPixel(31),
      marginTop: heightPixel(5),
      borderRadius: heightPixel(20),
      backgroundColor: colors.white,
      alignItems: 'center',
    },
    gradient: {
      borderRadius: heightPixel(10),
      marginTop: heightPixel(10),
      height: heightPixel(135),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: heightPixel(15),
    },
    sectionHeaderMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: heightPixel(10),
    },
    sectionHeader: {
      marginTop: heightPixel(0),
      marginBottom: heightPixel(0),
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.black,
    },
    viewAllText: {
      textDecorationLine: 'underline',
    },
    newProjectsList: {
      paddingBottom: heightPixel(2),
    },
    homeLoading: {
      paddingVertical: heightPixel(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    recentProjectsContainer: {
      marginTop: heightPixel(10),
      marginBottom: heightPixel(20),
      gap: heightPixel(15),
    },
  });
