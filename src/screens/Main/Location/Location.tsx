import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import {
  CustomScrollView,
  WelcomeHeader,
  SearchBar,
  GradientView,
} from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAppStyles, getColors, icons } from '../../../utilities';
import { useTheme } from '../../../hooks';
import MapView, { Marker, Circle } from 'react-native-maps';
import { newProjectsData } from '../../../data/projectData';
import ProjectCard from '../../../components/ProjectCard';
import { Portal, Modal } from 'react-native-paper';
import { ProjectItem } from '../../../interface';
import { useTranslation } from '../../../utilities/translations';

export default function MapScreen() {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const { t } = useTranslation();

  // const Header = ({ insets }: { insets: any }) => {
  //   return (
  //     <WelcomeHeader
  //       containerStyle={{
  //         paddingTop: insets.top || heightPixel(5),
  //       }}
  //       name="Map"
  //       hideProfile={true}
  //     />
  //   );
  // };
  // const navigation = useNavigation();
  // const insets = useSafeAreaInsets();
  const [selectedMarker, setSelectedMarker] = useState<ProjectItem | null>(
    null,
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     header: () => {
  //       return <Header insets={insets} />;
  //     },
  //   });
  // }, [insets, navigation]);

  const handleMarkerPress = (item: ProjectItem) => {
    setSelectedMarker(item);
  };

  const handleCloseCard = () => {
    setSelectedMarker(null);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    setShowFilterModal(false);
  };

  const filteredProjects = appliedFilters
    ? newProjectsData.filter(project => {
        const matchesLocation =
          !appliedFilters.selectedLocations.length ||
          appliedFilters.selectedLocations.includes(project.location);
        const matchesPropertyType =
          !appliedFilters.propertyType ||
          project.type === appliedFilters.propertyType;
        return matchesLocation && matchesPropertyType;
      })
    : newProjectsData;

  return (
    <View style={dynamicStyles(colors).container}>
      <MapView
        style={dynamicStyles(colors).map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
      >
        <Circle
          center={mapRegion}
          radius={5000}
          strokeWidth={1}
          strokeColor={'rgba(102, 51, 153, 0.5)'}
          fillColor={'rgba(102, 51, 153, 0.1)'}
        />
        {filteredProjects.map(item => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            onPress={() => handleMarkerPress(item)}
          >
            <View style={dynamicStyles(colors).markerContainer}>
              <Image
                source={icons.location}
                style={dynamicStyles(colors).markerIcon}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={dynamicStyles(colors).searchFilterContainer}>
        <SearchBar
          filter
          containerStyle={dynamicStyles(colors).searchbar}
          placeholder={t('searchyourplaces')}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowFilterModal(true)}
          style={dynamicStyles(colors).filterButton}
        >
          <Image
            source={icons.filter}
            style={dynamicStyles(colors).filtericon}
          />
        </TouchableOpacity>
      </View>

      {selectedMarker && (
        <View style={dynamicStyles(colors).projectCardContainer}>
          <TouchableOpacity
            onPress={handleCloseCard}
            style={dynamicStyles(colors).closeButton}
          >
            <Image
              source={icons.cross}
              style={dynamicStyles(colors).closeIcon}
            />
          </TouchableOpacity>
          <ProjectCard item={selectedMarker} cardWidth={widthPixel(345)} />
        </View>
      )}
      {/* <Portal>
        <Modal
          visible={showFilterModal}
          onDismiss={() => setShowFilterModal(false)}
          contentContainerStyle={dynamicStyles(colors).modalContainer}
        >
          <FilterModal onClose={() => setShowFilterModal(false)} onApplyFilters={handleApplyFilters} />
        </Modal>
      </Portal> */}
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Assuming a background color from theme
    },
    map: {
      flex: 1,
    },
    markerContainer: {
      backgroundColor: colors.white,
      borderRadius: heightPixel(20),
      padding: widthPixel(5),
      borderWidth: 1,
      borderColor: colors.purple2,
    },
    markerIcon: {
      width: widthPixel(20),
      height: heightPixel(20),
      tintColor: colors.purple1,
    },
    searchFilterContainer: {
      position: 'absolute',
      top: heightPixel(50),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: widthPixel(20),
      width: '100%',
    },
    searchbar: {
      flex: 1,
      borderRadius: 100,
      backgroundColor: colors.white,
      // ...Shadows.shadow3,
      marginRight: widthPixel(10),
    },
    filterButton: {
      backgroundColor: colors.purple1,
      borderRadius: heightPixel(25),
      width: widthPixel(40),
      height: heightPixel(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    filtericon: {
      width: widthPixel(20),
      height: heightPixel(20),
      // tintColor: colors.white,
      resizeMode: 'contain',
    },
    projectCardContainer: {
      position: 'absolute',
      bottom: heightPixel(110),
      paddingLeft: 20,
      justifyContent: 'center',
      alignSelf: 'center',
      alignContent: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: -heightPixel(10),
      right: widthPixel(10),
      zIndex: 1,
      backgroundColor: colors.white,
      borderRadius: heightPixel(15),
      width: widthPixel(20),
      height: heightPixel(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      width: widthPixel(10),
      height: heightPixel(10),
      tintColor: colors.red,
    },
    modalContainer: {
      backgroundColor: colors.background, // Assuming a background color from theme
      padding: widthPixel(20),
      margin: widthPixel(20),
      borderRadius: heightPixel(10),
    },
  });
