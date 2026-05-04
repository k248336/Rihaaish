import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  InteractionManager,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchBar } from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { icons, navigate, screens, utility } from '../../../utilities';
import { useAppDispatch, useTheme } from '../../../hooks';
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProjectCard from '../../../components/ProjectCard';
import { useTranslation } from '../../../utilities/translations';
import { fetchAllProperties, toggleFavoriteProperty } from '../../../redux/slices/property';
import {
  toListedPropertyCard,
  type ListedPropertyCard,
} from '../Profile/listedPropertyMapping';

const { width: W, height: H } = Dimensions.get('window');
const ASPECT = W / H;
const LAT_DELTA = 0.0922;
const LNG_DELTA = LAT_DELTA * ASPECT;

/** When user pauses typing, show suggestions (dropdown) after this delay. */
const MAP_SEARCH_DEBOUNCE_MS = 2000;
const MAX_SEARCH_SUGGESTIONS = 20;

type MapProperty = ListedPropertyCard & {
  latitude: number;
  longitude: number;
  city: string;
  isFavorite: boolean;
};

function propertyMatchesMapSearch(p: MapProperty, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (s.length === 0) {
    return false;
  }
  return (
    p.name.toLowerCase().includes(s) ||
    p.location.toLowerCase().includes(s) ||
    p.type.toLowerCase().includes(s) ||
    p.city.toLowerCase().includes(s) ||
    String(p.price).toLowerCase().includes(s) ||
    String(p.id).toLowerCase().includes(s) ||
    String(p.beds).includes(s) ||
    String(p.baths).includes(s) ||
    String(p.size).includes(s)
  );
}

function buildRegion(lat: number, lng: number): Region {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: LAT_DELTA,
    longitudeDelta: LNG_DELTA,
  };
}

function mapApiToMapProperty(p: Record<string, unknown>): MapProperty | null {
  const lat = Number(p.location_lat ?? p.latitude ?? p.lat);
  const lng = Number(p.location_lng ?? p.longitude ?? p.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return {
    ...toListedPropertyCard(p),
    latitude: lat,
    longitude: lng,
    city: String(p.city ?? '').trim(),
    isFavorite: Boolean(p.is_favorite),
  };
}

const geoOptions =
  Platform.OS === 'android'
    ? {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
        distanceFilter: 0,
        showLocationDialog: true,
        forceRequestLocation: false,
        forceLocationManager: true,
      }
    : {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        distanceFilter: 0,
      };

export default function MapScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [selectedMarker, setSelectedMarker] = useState<MapProperty | null>(null);
  const [, setShowFilterModal] = useState(false);
  const [rawProperties, setRawProperties] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [myLocationLoading, setMyLocationLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: LAT_DELTA,
    longitudeDelta: LNG_DELTA,
  });
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const didFitInitial = useRef(false);
  const userLocationAppliedRef = useRef(false);
  const mapRef = useRef<MapView | null>(null);
  const skipSearchDebounce = useRef(false);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const loadProperties = useCallback(async (): Promise<MapProperty[]> => {
    setLoading(true);
    try {
      const raw = await dispatch(fetchAllProperties()).unwrap();
      setRawProperties(raw as Record<string, unknown>[]);
      return (raw as Record<string, unknown>[])
        .map(mapApiToMapProperty)
        .filter((x): x is MapProperty => x != null);
    } catch {
      setRawProperties([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const mapProperties = useMemo((): MapProperty[] => {
    const list: MapProperty[] = [];
    for (const p of rawProperties) {
      const m = mapApiToMapProperty(p);
      if (m) {
        list.push(m);
      }
    }
    return list;
  }, [rawProperties]);

  useEffect(() => {
    if (skipSearchDebounce.current) {
      skipSearchDebounce.current = false;
      return;
    }
    const id = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, MAP_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchText]);

  const searchSuggestions = useMemo(() => {
    if (debouncedSearch.length === 0) {
      return [];
    }
    return mapProperties
      .filter(p => propertyMatchesMapSearch(p, debouncedSearch))
      .slice(0, MAX_SEARCH_SUGGESTIONS);
  }, [mapProperties, debouncedSearch]);

  const onSelectPropertyFromSearch = useCallback((p: MapProperty) => {
    Keyboard.dismiss();
    skipSearchDebounce.current = true;
    setSearchText(p.name);
    setDebouncedSearch('');
    const region = buildRegion(p.latitude, p.longitude);
    setMapRegion(region);
    requestAnimationFrame(() => {
      mapRef.current?.animateToRegion(region, 500);
    });
    setSelectedMarker(p);
  }, []);

  const requestLocationAccess = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      try {
        const s = await Geolocation.requestAuthorization('whenInUse');
        if (s === 'granted') {
          return true;
        }
        Alert.alert(t('mapLocationTitle'), t('mapLocationPermissionBody'), [
          { text: t('ok'), style: 'cancel' },
          { text: t('settings'), onPress: () => Linking.openSettings() },
        ]);
        return false;
      } catch {
        return false;
      }
    }

    if (Platform.OS === 'android' && PermissionsAndroid) {
      const p = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      try {
        const has = await PermissionsAndroid.check(p);
        if (has) {
          return true;
        }
        const r = await PermissionsAndroid.request(p, {
          title: t('mapLocationTitle'),
          message: t('mapLocationPermissionBody'),
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (r === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
        if (r === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(t('mapLocationTitle'), t('mapLocationPermissionBody'), [
            { text: t('ok'), style: 'cancel' },
            { text: t('settings'), onPress: () => Linking.openSettings() },
          ]);
        } else {
          utility.showAlertMessage('danger', t('mapLocationPermissionBody'));
        }
        return false;
      } catch {
        return false;
      }
    }
    return true;
  }, [t]);

  const centerOnGps = useCallback(
    (fromMyLocationButton: boolean) => {
      if (fromMyLocationButton) {
        setMyLocationLoading(true);
      }
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          userLocationAppliedRef.current = true;
          didFitInitial.current = true;
          const region = buildRegion(latitude, longitude);
          setMapRegion(region);
          requestAnimationFrame(() => {
            mapRef.current?.animateToRegion(region, 400);
          });
          if (fromMyLocationButton) {
            setMyLocationLoading(false);
          }
        },
        err => {
          if (fromMyLocationButton) {
            setMyLocationLoading(false);
          }
          const code = (err as { code?: number })?.code;
          if (code === 1) {
            Alert.alert(t('mapLocationTitle'), t('mapLocationPermissionBody'), [
              { text: t('ok'), style: 'cancel' },
              { text: t('settings'), onPress: () => Linking.openSettings() },
            ]);
            return;
          }
          if (code === 2) {
            utility.showAlertMessage('danger', t('mapGpsOrLocationOff'));
            return;
          }
          if (code === 4) {
            utility.showAlertMessage(
              'danger',
              'Location services are unavailable. Check Google Play services or try again.',
            );
            return;
          }
          if (code === 5) {
            utility.showAlertMessage('danger', t('mapGpsOrLocationOff'));
            return;
          }
          utility.showAlertMessage('danger', t('mapGpsOrLocationOff'));
        },
        geoOptions as any,
      );
    },
    [t],
  );

  const onPressMyLocation = useCallback(async () => {
    const ok = await requestLocationAccess();
    if (!ok) {
      return;
    }
    centerOnGps(true);
  }, [requestLocationAccess, centerOnGps]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      InteractionManager.runAfterInteractions(() => {
        setTimeout(async () => {
          if (cancelled) {
            return;
          }
          if (userLocationAppliedRef.current) {
            return;
          }
          const ok = await requestLocationAccess();
          if (cancelled || !ok) {
            return;
          }
          if (!userLocationAppliedRef.current) {
            centerOnGps(false);
          }
        }, 450);
      });
      return () => {
        cancelled = true;
      };
    }, [requestLocationAccess, centerOnGps]),
  );

  useEffect(() => {
    if (didFitInitial.current || userLocationAppliedRef.current || mapProperties.length === 0) {
      return;
    }
    didFitInitial.current = true;
    const first = mapProperties[0];
    setMapRegion(r => ({
      ...r,
      latitude: first.latitude,
      longitude: first.longitude,
    }));
  }, [mapProperties]);

  const handleMarkerPress = (item: MapProperty) => {
    setSelectedMarker(item);
  };

  const handleCloseCard = () => {
    setSelectedMarker(null);
  };

  const filteredProjects = useMemo(() => {
    if (!appliedFilters) {
      return mapProperties;
    }
    return mapProperties.filter(project => {
      const matchesLocation =
        !appliedFilters.selectedLocations.length ||
        appliedFilters.selectedLocations.includes(project.location) ||
        appliedFilters.selectedLocations.includes(project.city);
      const matchesPropertyType =
        !appliedFilters.propertyType ||
        project.type === appliedFilters.propertyType;
      return matchesLocation && matchesPropertyType;
    });
  }, [mapProperties, appliedFilters]);

  const handleFavouritePress = async (itemId: string) => {
    try {
      await dispatch(toggleFavoriteProperty(itemId)).unwrap();
      const list = await loadProperties();
      setSelectedMarker(prev => {
        if (!prev || String(prev.id) !== String(itemId)) {
          return prev;
        }
        return list.find(p => p.id === prev.id) ?? prev;
      });
    } catch {
    }
  };

  const circleCenter = {
    latitude: mapRegion.latitude,
    longitude: mapRegion.longitude,
  };

  return (
    <View style={dynamicStyles(colors).container}>
      <MapView
        ref={mapRef}
        style={dynamicStyles(colors).map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Circle
          center={circleCenter}
          radius={5000}
          strokeWidth={1}
          strokeColor={'rgba(102, 51, 153, 0.5)'}
          fillColor={'rgba(102, 51, 153, 0.1)'}
        />
        {filteredProjects.map(item => (
          <Marker
            key={item.id}
            zIndex={1}
            tracksViewChanges={false}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            onPress={() => handleMarkerPress(item)}
          >
            <View style={dynamicStyles(colors).propertyMarkerWrap}>
              <Image
                source={icons.location}
                style={[
                  dynamicStyles(colors).propertyMarkerIcon,
                  { tintColor: colors.purple1 },
                ]}
                resizeMode="contain"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={dynamicStyles(colors).loadingOverlay}>
          <ActivityIndicator size="large" color={colors.purple1} />
        </View>
      )}

      <View style={dynamicStyles(colors).searchFilterContainer}>
        <View style={dynamicStyles(colors).searchColumn}>
          <SearchBar
            filter={false}
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={dynamicStyles(colors).searchbar}
            placeholder={t('searchyourplaces')}
          />
          {debouncedSearch.length > 0 && (
            <View style={dynamicStyles(colors).searchDropdown}>
              {searchSuggestions.length === 0 ? (
                <Text
                  style={[
                    dynamicStyles(colors).searchEmptyText,
                    { color: colors.greaytext },
                  ]}
                >
                  {t('mapSearchNoResults')}
                </Text>
              ) : (
                <FlatList
                  data={searchSuggestions}
                  keyExtractor={item => String(item.id)}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  style={dynamicStyles(colors).searchFlatList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => onSelectPropertyFromSearch(item)}
                      style={dynamicStyles(colors).searchSuggestionRow}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          dynamicStyles(colors).searchSuggestionTitle,
                          { color: colors.primary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          dynamicStyles(colors).searchSuggestionSub,
                          { color: colors.greaytext },
                        ]}
                      >
                        {[item.location, item.type].filter(Boolean).join(' · ')}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </View>
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

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPressMyLocation}
        disabled={myLocationLoading}
        style={[
          dynamicStyles(colors).myLocationButton,
          {
            backgroundColor: colors.purple1,
            bottom: heightPixel(110) + insets.bottom,
            shadowColor: colors.black,
          },
        ]}
      >
        {myLocationLoading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <>
            <Image
              source={icons.location}
              style={[
                dynamicStyles(colors).myLocationIcon,
                { tintColor: colors.white },
              ]}
            />
            {/* <Text
              numberOfLines={1}
              style={[
                dynamicStyles(colors).myLocationLabel,
                { color: colors.white },
              ]}
            >
              {t('mapMyLocation')}
            </Text> */}
          </>
        )}
      </TouchableOpacity>

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
          <ProjectCard
            item={selectedMarker}
            cardWidth={widthPixel(345)}
            isFavorite={selectedMarker.isFavorite}
            onPressCard={() => {
              navigate(screens.PropertyDetail, {
                propertyId: selectedMarker.id,
              });
            }}
            onPressFavorite={() => handleFavouritePress(selectedMarker.id)}
          />
        </View>
      )}
    </View>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      flex: 1,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    propertyMarkerWrap: {
      backgroundColor: colors.white,
      borderRadius: heightPixel(22),
      padding: widthPixel(4),
      borderWidth: 1,
      borderColor: colors.purple2,
    },
    propertyMarkerIcon: {
      width: widthPixel(20),
      height: heightPixel(20),
    },
    searchFilterContainer: {
      position: 'absolute',
      top: heightPixel(50),
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: widthPixel(20),
      width: '100%',
      zIndex: 20,
      elevation: 12,
    },
    searchColumn: {
      flex: 1,
      marginRight: widthPixel(10),
      zIndex: 21,
    },
    searchbar: {
      borderRadius: 100,
      backgroundColor: colors.white,
    },
    searchDropdown: {
      marginTop: heightPixel(4),
      borderRadius: 12,
      backgroundColor: colors.white,
      maxHeight: heightPixel(240),
      overflow: 'hidden',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4,
    },
    searchFlatList: {
      maxHeight: heightPixel(220),
    },
    searchEmptyText: {
      paddingVertical: heightPixel(14),
      paddingHorizontal: widthPixel(14),
      fontSize: 13,
    },
    searchSuggestionRow: {
      paddingVertical: heightPixel(10),
      paddingHorizontal: widthPixel(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.purple2 + '55',
    },
    searchSuggestionTitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    searchSuggestionSub: {
      fontSize: 12,
      marginTop: 2,
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
      resizeMode: 'contain',
    },
    myLocationButton: {
      position: 'absolute',
      right: widthPixel(16),
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      gap: 8,
      zIndex: 2,
      elevation: 4,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    myLocationIcon: {
      width: widthPixel(20),
      height: heightPixel(20),
      resizeMode: 'contain',
    },
    myLocationLabel: {
      fontSize: 14,
      fontWeight: '600',
      maxWidth: widthPixel(120),
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
      backgroundColor: colors.background,
      padding: widthPixel(20),
      margin: widthPixel(20),
      borderRadius: heightPixel(10),
    },
  });
