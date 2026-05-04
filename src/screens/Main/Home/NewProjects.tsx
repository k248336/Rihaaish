import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SearchBar, GradientView } from '../../../components';
import ProjectCard from '../../../components/ProjectCard';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  getAppStyles,
  icons,
  getShadows,
  navigate,
  screens,
} from '../../../utilities';
import { useAppDispatch, useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import {
  fetchAllProperties,
  toggleFavoriteProperty,
} from '../../../redux/slices/property';
import {
  toListedPropertyCard,
  type ListedPropertyCard,
} from '../Profile/listedPropertyMapping';

type ListItem = ListedPropertyCard & { isFavorite: boolean };

function mapApiToItem(p: Record<string, unknown>): ListItem {
  return {
    ...toListedPropertyCard(p),
    isFavorite: Boolean(p.is_favorite),
  };
}

export default function NewProjects() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  const load = useCallback(
    async (opts?: { refreshOnly?: boolean }) => {
      if (opts?.refreshOnly) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const raw = await dispatch(fetchAllProperties()).unwrap();
        setItems((raw as Record<string, unknown>[]).map(mapApiToItem));
      } catch {
        if (!opts?.refreshOnly) {
          setItems([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    load({ refreshOnly: true });
  }, [load]);

  const handleFavouritePress = async (itemId: string) => {
    try {
      await dispatch(toggleFavoriteProperty(itemId)).unwrap();
      await load({ refreshOnly: true });
    } catch {
      // checkError from postService
    }
  };

  return (
    <View style={[appStyles.container, { backgroundColor: colors.background }]}>
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
          placeholder={t('searchyourplaces')}
        />
        <GradientView style={dynamicStyles(colors).filterview}>
          <Image
            source={icons.filter}
            style={dynamicStyles(colors).filtericon}
          />
        </GradientView>
      </View>
      {loading && items.length === 0 ? (
        <View style={dynamicStyles(colors).loadingWrap}>
          <ActivityIndicator size="large" color={colors.purple1} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={dynamicStyles(colors).favoriteListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.purple1]}
              tintColor={colors.purple1}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <Text
                style={{
                  paddingTop: heightPixel(24),
                  color: colors.greaytext,
                  fontSize: 14,
                }}
              >
                No properties yet.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <ProjectCard
              item={item}
              cardWidth={widthPixel(345)}
              onPressCard={() =>
                navigate(screens.PropertyDetail, { propertyId: item.id })
              }
              onPressFavorite={() => handleFavouritePress(item.id)}
              isFavorite={item.isFavorite}
            />
          )}
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
      ...getShadows(false).shadow3,
    },
    filterview: {
      width: widthPixel(40),
      height: heightPixel(40),
      borderRadius: 100,
    },
    filtericon: {
      width: widthPixel(16),
      height: heightPixel(16),
      resizeMode: 'contain',
    },
    favoriteListContent: {
      paddingHorizontal: widthPixel(20),
      paddingBottom: heightPixel(120),
      marginTop: heightPixel(15),
      gap: heightPixel(15),
    },
    loadingWrap: {
      flex: 1,
      paddingVertical: heightPixel(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
