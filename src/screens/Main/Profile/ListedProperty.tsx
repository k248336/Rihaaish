import { FlatList, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { recentProjectsData } from '../../../data/projectData';
import FavoriteProjectCard from '../../../components/FavoriteProjectCard';
import { heightPixel } from '../../../utilities/helpers';
import {
  AlertModal,
  CustomFlatlist,
  CustomScrollView,
} from '../../../components';
import { getAppStyles, icons } from '../../../utilities';
import { useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';

export default function ListedProperty() {
  const [listedProjects, setListedProjects] = useState(recentProjectsData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { t } = useTranslation();

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const handleEditPress = (itemId: string) => {
    // navigation.navigate("EditProject", { projectId: itemId });
  };

  const handleOpenDeleteModal = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId) {
      setListedProjects(prev =>
        prev.filter(item => item.id !== selectedItemId),
      );
    }
    setShowDeleteModal(false);
    setSelectedItemId(null);
  };

  return (
    <View style={[appStyles.container, { backgroundColor: colors.background }]}>
      <CustomFlatlist
        data={listedProjects}
        renderItem={({ item }) => (
          <FavoriteProjectCard
            item={item}
            listedProperty
            isFavorite={false}
            onPressDelete={() => handleOpenDeleteModal(item.id)}
            onPressEdit={() => handleEditPress(item.id)}
          />
        )}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={dynamicStyles(colors).favoriteListContent}
      />

      <AlertModal
        title={'DeleteProperties'}
        showCrossIcon
        backgroundcolor={colors.redOpacity}
        subText={'deletepropertydes'}
        logoImage={icons.deleteicon}
        // showAlertBtn={'Delete'}
        visible={showDeleteModal}
        confirmBtnTitle="Yes"
        onConfirm={handleConfirmDelete}
        setVisible={() => {
          setShowDeleteModal(false);
        }}
      />
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    favoriteListContent: {
      paddingBottom: heightPixel(20),
      paddingHorizontal: 15,
      marginTop: heightPixel(15),
    },
  });
