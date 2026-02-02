import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { WelcomeHeader, SearchBar, GradientView } from '../../../components';
import FavoriteProjectCard from '../../../components/FavoriteProjectCard';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getAppStyles,
  getShadows,
  icons,
  navigate,
  screens,
} from '../../../utilities';
import { recentProjectsData } from '../../../data/projectData';
import { useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';

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
  const [isFavourite, setIsFavourite] = useState<string[]>(['1']);
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const Shadows = getShadows(isDarkMode);
  const { t } = useTranslation();

  const handleFavouritePress = (itemId: string) => {
    setIsFavourite(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId],
    );
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
      <FlatList
        data={recentProjectsData}
        renderItem={({ item }) => (
          <FavoriteProjectCard
            item={item}
            onPressCard={() => {
              navigate(screens.PropertyDetail);
            }}
            onPressFavorite={() => handleFavouritePress(item.id)}
            isFavorite={isFavourite.includes(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles(colors).favoriteListContent}
      />
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
  });
