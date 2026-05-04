import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { WelcomeHeader, SearchBar, GradientView } from '../../../components';
import FavoriteProjectCard from '../../../components/FavoriteProjectCard';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAppStyles, icons, navigate, screens } from '../../../utilities';
import { useAppDispatch, useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import {
  fetchMyFavorites,
  toggleFavoriteProperty,
} from '../../../redux/slices/property';
import {
  toListedPropertyCard,
  type ListedPropertyCard,
} from '../Profile/listedPropertyMapping';

export default function Favourite() {
  const Header = ({ insets }: { insets: any }) => {
    return (
      <WelcomeHeader
        containerStyle={{
          paddingTop: insets.top || heightPixel(5),
        }}
        name="Favourites"
        hideProfile={true}
      />
    );
  };
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [cards, setCards] = useState<ListedPropertyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  const loadFavorites = useCallback(
    async (opts?: { refreshOnly?: boolean }) => {
      if (opts?.refreshOnly) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const raw = await dispatch(fetchMyFavorites()).unwrap();
        const mapped = (raw as Record<string, unknown>[]).map(p =>
          toListedPropertyCard(p),
        );
        setCards(mapped);
      } catch {
        if (!opts?.refreshOnly) {
          setCards([]);
        }
      } finally {
        if (opts?.refreshOnly) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const handleFavouritePress = async (itemId: string) => {
    try {
      await dispatch(toggleFavoriteProperty(itemId)).unwrap();
      await loadFavorites({ refreshOnly: true });
    } catch {
      // postService surfaces checkError on failure
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <Header insets={insets} />;
      },
    });
  }, [insets, navigation]);
  return (
    <View
      style={[appStyles.container, { }]}
    >
      <View
        style={[
          appStyles.flexRowBetween,
          {
            gap: 0,
            paddingHorizontal: 15,

            marginTop: heightPixel(10),
          },
        ]}
      >
        <SearchBar
          filter
          containerStyle={dynamicStyles(colors).searchbar}
          placeholder={t("searchyourplaces")}
        />
        <GradientView style={dynamicStyles(colors).filterview}>
          <Image
            source={icons.filter}
            style={dynamicStyles(colors).filtericon}
          />
        </GradientView>
      </View>
      {loading ? (
        <View style={dynamicStyles(colors).centered}>
          <ActivityIndicator size="large" color={colors.purple1} />
        </View>
      ) : cards.length === 0 ? (
        <View style={dynamicStyles(colors).centered}>
          <Text style={{ color: colors.greaytext, fontSize: 14 }}>
            No favourites yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          refreshing={refreshing}
          onRefresh={() => loadFavorites({ refreshOnly: true })}
          renderItem={({ item }) => (
            <FavoriteProjectCard
              item={item}
              onPressCard={() => {
                navigate(screens.PropertyDetail, { propertyId: item.id });
              }}
              onPressFavorite={() => handleFavouritePress(item.id)}
              isFavorite={true}
              emphasizeFilledHeart
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={dynamicStyles(colors).favoriteListContent}
        />
      )}
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    searchFilterContainer: {
      marginHorizontal: widthPixel(20),
      marginTop: heightPixel(10),
      marginBottom: heightPixel(20),
      gap: widthPixel(10),
    },
    searchbar: {
      width: widthPixel(290),
      borderRadius: 100,
      backgroundColor: colors.white,
    },
    filterview: {
      width: widthPixel(40),
      height: heightPixel(40),
      borderRadius: 100,
    },
    filtericon: {
      width: widthPixel(16),
      height: heightPixel(16),
      tintColor: '#fff',
      resizeMode: 'contain',
    },
    favoriteListContent: {
      paddingHorizontal: widthPixel(20),
      paddingBottom: heightPixel(120),
      marginTop: heightPixel(15),
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: widthPixel(24),
    },
  });
