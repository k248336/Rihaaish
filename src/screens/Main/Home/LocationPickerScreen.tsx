import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  InteractionManager,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation, useRoute } from '@react-navigation/native';
import { utility, screens } from '../../../utilities';
import {
  GOOGLE_MAPS_API_KEY,
  GooglePlacesAutocompleteDefaultProps,
} from '../../../config/mapsConfig';
import { icons } from '../../../utilities/images';
import { heightPixel } from '../../../utilities/helpers';
import CustomButton from '../../../components/CustomButton';
import {
  GooglePlacesAutocompleteRef,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DEFAULT_LAT = 33.6844;
const DEFAULT_LNG = 73.0479;

const initialMapRegion: Region = {
  latitude: DEFAULT_LAT,
  longitude: DEFAULT_LNG,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

function regionAround(lat: number, lng: number): Region {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
}

function readPlaceLatLng(details: {
  geometry?: { location?: { lat?: number | (() => number); lng?: number | (() => number) } };
}): { lat: number; lng: number } | null {
  const loc = details?.geometry?.location;
  if (!loc) {
    return null;
  }
  const latRaw = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
  const lngRaw = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
  if (typeof latRaw !== 'number' || typeof lngRaw !== 'number') {
    return null;
  }
  return { lat: latRaw, lng: lngRaw };
}

function buildAddressFromPlace(
  data: {
    description?: string;
    structured_formatting?: { main_text?: string; secondary_text?: string };
  },
  details: { formatted_address?: string } | null | undefined,
): string {
  const fromDetails = details?.formatted_address?.trim();
  if (fromDetails) {
    return fromDetails;
  }
  const s = data?.structured_formatting;
  if (s?.main_text || s?.secondary_text) {
    return [s.main_text, s.secondary_text].filter(Boolean).join(', ');
  }
  return data?.description?.trim() || '';
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const data = await res.json();
    return data.results?.[0]?.formatted_address ?? null;
  } catch {
    return null;
  }
}

const MAP_HEADER_ROW_H = 44;

const LocationPickerScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
  });
  const [currentAddress, setCurrentAddress] = useState('');
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const placesAutocompleteQuery = useMemo(
    () => ({
      key: GOOGLE_MAPS_API_KEY || 'placeholder',
      language: 'en',
       components: 'country:pk',
      location: `${markerCoordinate.latitude},${markerCoordinate.longitude}`,
      radius: 800000000000,
      strictbounds: true,
      types: 'geocode',
    }),
    [markerCoordinate.latitude, markerCoordinate.longitude],
  );

  const animateMapTo = useCallback((lat: number, lng: number) => {
    const next = regionAround(lat, lng);
    mapRef.current?.animateToRegion(next, 400);
  }, []);

  useEffect(() => {
    const lat = route.params?.initialLatitude;
    const lng = route.params?.initialLongitude;
    const addr = route.params?.initialAddress;
    if (typeof lat === 'number' && typeof lng === 'number') {
      const next = { latitude: lat, longitude: lng };
      setMarkerCoordinate(next);
      requestAnimationFrame(() => animateMapTo(lat, lng));
    }
    if (typeof addr === 'string' && addr.trim()) {
      setCurrentAddress(addr.trim());
    }
  }, [
    route.params?.initialLatitude,
    route.params?.initialLongitude,
    route.params?.initialAddress,
    animateMapTo,
  ]);

  const getCurrentLocation = useCallback(() => {
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

    Geolocation.getCurrentPosition(
      async (position: { coords: { latitude: number; longitude: number } }) => {
        const { latitude, longitude } = position.coords;
        const next = { latitude, longitude };
        setMarkerCoordinate(next);
        animateMapTo(latitude, longitude);
        setGeocodeLoading(true);
        const addr = await reverseGeocode(latitude, longitude);
        setGeocodeLoading(false);
        if (addr) {
          setCurrentAddress(addr);
        }
      },
      err => {
        const code = (err as { code?: number })?.code;
        let msg =
          'Could not get current location. Pick a place on the map or search.';
        if (code === 4) {
          msg =
            'Google Play services is missing or outdated. Use search or move the pin.';
        } else if (code === 5) {
          msg = 'Turn on device location (GPS) or use search above.';
        }
        utility.showAlertMessage('danger', msg);
      },
      geoOptions as any,
    );
  }, [animateMapTo]);

  const scheduleGetCurrentLocation = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        getCurrentLocation();
      }, 600);
    });
  }, [getCurrentLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
          scheduleGetCurrentLocation();
        } else {
          utility.showAlertMessage(
            'danger',
            'Location permission is required to use your current position.',
          );
        }
      } catch {
        utility.showAlertMessage(
          'danger',
          'Could not request location permission.',
        );
      }
      return;
    }

    if (Platform.OS !== 'android' || !PermissionsAndroid) {
      return;
    }

    const fine = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

    try {
      const already = await PermissionsAndroid.check(fine);
      if (already) {
        scheduleGetCurrentLocation();
        return;
      }

      const granted = await PermissionsAndroid.request(fine, {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        scheduleGetCurrentLocation();
      }
    } catch {
      utility.showAlertMessage(
        'danger',
        'Could not request location permission. Try again or pick on the map.',
      );
    }
  };

  const onMarkerDragEnd = useCallback(async (latitude: number, longitude: number) => {
    const next = { latitude, longitude };
    setMarkerCoordinate(next);
    setGeocodeLoading(true);
    const addr = await reverseGeocode(latitude, longitude);
    setGeocodeLoading(false);
    if (addr) {
      setCurrentAddress(addr);
    }
  }, []);

  const handleSaveLocation = () => {
    if (!currentAddress?.trim()) {
      utility.showAlertMessage(
        'danger',
        'Please search or move the pin to select an address.',
      );
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      utility.showAlertMessage(
        'danger',
        'Add your Google Maps API key in src/config/mapsConfig.ts (GOOGLE_MAPS_API_KEY).',
      );
      return;
    }

    navigation.navigate({
      name: screens.AddProperty,
      params: {
        pickedLocation: {
          address: currentAddress.trim(),
          latitude: markerCoordinate.latitude,
          longitude: markerCoordinate.longitude,
        },
      },
      merge: true,
    });
  };

  const textInputStyles = {
    textInput: {
      fontSize: 14,
      borderRadius: 12,
      color: colors.black,
    },
    container: {
      backgroundColor: colors.white,
      borderRadius: 10,
    },
    description: {
      color: colors.primary,
    },
    listView: {
      backgroundColor: colors.white,
    },
  };

  const searchTop = insets.top + MAP_HEADER_ROW_H + heightPixel(8);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialMapRegion}
      >
        <Marker
          draggable
          coordinate={markerCoordinate}
          onDragEnd={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            onMarkerDragEnd(latitude, longitude);
          }}
        />
      </MapView>

      <View
        style={[
          styles.floatingHeader,
          {
            paddingTop: insets.top,
            backgroundColor: 'rgba(26, 29, 36, 0.88)',
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.floatingHeaderBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Image
            source={icons.backArrow}
            style={styles.floatingHeaderBackIcon}
            resizeMode="contain"
            tintColor="#ffffff"
          />
        </TouchableOpacity>
        <Text style={styles.floatingHeaderTitle} numberOfLines={1}>
          {t('pickLocation')}
        </Text>
      </View>

      <View
        style={[
          styles.searchContainer,
          { top: searchTop, backgroundColor: colors.white, shadowColor: colors.black },
        ]}
      >
        <GooglePlacesAutocomplete
          {...GooglePlacesAutocompleteDefaultProps}
          fetchDetails
          GooglePlacesDetailsQuery={{
            fields: 'formatted_address,geometry,place_id,name',
          }}
          textInputProps={{
            clearButtonMode: 'never',
            placeholderTextColor: colors.greaytext,
            color: colors.black,
          }}
          ref={googlePlacesRef}
          placeholder="Search your location…"
          enablePoweredByContainer={false}
          onPress={(data: any, details: any = null) => {
            const ll = details ? readPlaceLatLng(details) : null;
            if (ll) {
              setMarkerCoordinate({ latitude: ll.lat, longitude: ll.lng });
              animateMapTo(ll.lat, ll.lng);
            }
            const address = buildAddressFromPlace(data, details);
            if (address) {
              setCurrentAddress(address);
            } else if (!ll) {
              utility.showAlertMessage(
                'danger',
                'Could not load this place. Try another search result.',
              );
            }
          }}
          query={placesAutocompleteQuery}
          styles={textInputStyles}
          renderRightButton={() => (
            <>
              {googlePlacesRef?.current?.getAddressText?.() != '' && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.crossIconView}
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  onPress={() => googlePlacesRef?.current?.setAddressText('')}
                >
                  <Image
                    resizeMode="contain"
                    tintColor={colors.greaytext}
                    source={icons.cross}
                    style={styles.crossIcon}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={requestLocationPermission}
          style={[
            styles.currentLocationTextButton,
            {
              borderColor: colors.purple1,
              backgroundColor: colors.white,
            },
          ]}
        >
          <Image
            resizeMode="contain"
            tintColor={colors.purple1}
            source={icons.location}
            style={styles.currentLocationTextButtonIcon}
          />
          <Text
            style={[styles.currentLocationTextButtonLabel, { color: colors.purple1 }]}
          >
            {t('useCurrentLocation')}
          </Text>
        </TouchableOpacity>

        {geocodeLoading && (
          <ActivityIndicator
            style={{ marginVertical: 8 }}
            color={colors.purple1}
          />
        )}

        {!!currentAddress && (
          <View
            style={[
              styles.addressPreview,
              { backgroundColor: colors.whiteSmoke },
            ]}
          >
            <Text
              style={[styles.currentAddressText, { color: colors.primary }]}
              numberOfLines={4}
            >
              {currentAddress}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setCurrentAddress('');
                googlePlacesRef?.current?.setAddressText('');
              }}
              style={styles.clearAddressButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                resizeMode="contain"
                tintColor={colors.greaytext}
                source={icons.cross}
                style={styles.crossIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, heightPixel(8)) },
        ]}
      >
        <CustomButton
          gradient
          title={t('saveLocation')}
          btnStyle={styles.saveButton}
          onPress={handleSaveLocation}
        />
        {/* <CustomButton
          title="Cancel"
          onPress={() => pop()}
          btnStyle={styles.cancelBtn}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d24',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    minHeight: MAP_HEADER_ROW_H,
    paddingHorizontal: 6,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  floatingHeaderBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeaderBackIcon: {
    width: 22,
    height: 22,
  },
  floatingHeaderTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 40,
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    zIndex: 2,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  currentLocationTextButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  currentLocationTextButtonIcon: {
    height: 20,
    width: 20,
  },
  currentLocationTextButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  crossIcon: {
    height: 12,
    width: 12,
  },
  crossIconView: {
    marginRight: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressPreview: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  currentAddressText: {
    flex: 1,
    fontSize: 13,
  },
  clearAddressButton: {
    padding: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    gap: 10,
    paddingTop: heightPixel(8),
  },
  saveButton: {
    width: '90%',
    alignSelf: 'center',
  },
  cancelBtn: {
    width: '90%',
    alignSelf: 'center',
  },
});

export default LocationPickerScreen;
