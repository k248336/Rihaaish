import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  CustomButton,
  CustomScrollView,
  WelcomeHeader,
  CustomTabs,
} from '../../../components';
import {
  getAppStyles,
  getShadows,
  icons,
  screens,
  strings,
  utility,
} from '../../../utilities';
import { ImagePickerModal } from '../../../components/modals';
import { CustomText, CustomTextInput } from '../../../components';
import MultiImagePicker from '../../../components/MultiImagePicker';
import { TabView } from 'react-native-tab-view';
import { useAppDispatch, useTheme } from '../../../hooks';
import {
  createProperty,
  hideLoader,
  showLoader,
  updateProperty,
} from '../../../redux/slices';
import { listPropertyImageUrls } from '../Profile/listedPropertyMapping';
import { useTranslation } from '../../../utilities/translations';

/** Default map pin (Islamabad) — sent in API only, not shown on screen */
const DEFAULT_LOCATION_LAT = '33.6844';
const DEFAULT_LOCATION_LNG = '73.0479';

function tabIndexForApiPropertyType(propertyType: string): number {
  const s = propertyType.trim();
  if (['Shop', 'Office', 'Warehouse'].includes(s)) {
    return 2;
  }
  if (['Residential', 'Commercial'].includes(s)) {
    return 1;
  }
  return 0;
}

function parseSqftFromApi(size: unknown): number {
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }
  const n = parseInt(String(size ?? '').replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n : 1500;
}

export default function AddProperty() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [iWantTo, setIWantTo] = useState('Sell');
  const [locations, setLocations] = useState(['Gulshan', 'Shah Faisal', 'DHA']);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();
  const [propertyType, setPropertyType] = useState('Home');
  const [selectedPropertySubType, setSelectedPropertySubType] = useState<
    string | null
  >(null);
  const [priceRange, setPriceRange] = useState(0);
  const [sizeSqft, setSizeSqft] = useState(1500);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [numBeds, setNumBeds] = useState<string>('');
  const [numWashrooms, setNumWashrooms] = useState<string>('');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [routes] = useState([
    { key: 'Home', title: t('Home') },
    {
      key: 'Plot',
      title: t('Plot'),
    },
    {
      key: 'Commercial',
      title: t('Commercial'),
    },
  ]);

  const [multiImages, setMultiImages] = useState<any[]>([]);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [mapLatLng, setMapLatLng] = useState({
    lat: DEFAULT_LOCATION_LAT,
    lng: DEFAULT_LOCATION_LNG,
  });

  /** Tracks last loaded edit `property.id` so we only reset when leaving edit for a new add — not when merging `pickedLocation` from LocationPicker. */
  const lastLoadedPropertyIdRef = useRef<string | null>(null);

  const resetAddPropertyForm = useCallback(() => {
    setEditingPropertyId(null);
    setMapLatLng({ lat: DEFAULT_LOCATION_LAT, lng: DEFAULT_LOCATION_LNG });
    setCoverPhoto(null);
    setMultiImages([]);
    setIWantTo('Sell');
    setLocations(['Gulshan', 'Shah Faisal', 'DHA']);
    setShowLocationInput(false);
    setNewLocation('');
    setTabIndex(0);
    setPropertyType('Home');
    setSelectedPropertySubType(null);
    setPriceRange(0);
    setSizeSqft(1500);
    setSelectedLocations([]);
    setNumBeds('');
    setNumWashrooms('');
    setPropertyTitle('');
    setDescription('');
    setAddress('');
  }, []);

  useEffect(() => {
    const p = route.params?.property as Record<string, unknown> | undefined;
    const editId = p?.id != null ? String(p.id) : null;

    if (editId == null) {
      if (lastLoadedPropertyIdRef.current != null) {
        lastLoadedPropertyIdRef.current = null;
        resetAddPropertyForm();
      }
      return;
    }

    if (!p) {
      return;
    }

    lastLoadedPropertyIdRef.current = editId;
    setEditingPropertyId(editId);
    const editLat = Number(p.location_lat ?? DEFAULT_LOCATION_LAT);
    const editLng = Number(p.location_lng ?? DEFAULT_LOCATION_LNG);
    setMapLatLng({
      lat: Number.isFinite(editLat)
        ? editLat.toFixed(6)
        : DEFAULT_LOCATION_LAT,
      lng: Number.isFinite(editLng)
        ? editLng.toFixed(6)
        : DEFAULT_LOCATION_LNG,
    });
    setPropertyTitle(String(p.title ?? ''));
    setDescription(String(p.description ?? ''));
    const priceNum =
      typeof p.price === 'number'
        ? p.price
        : parseFloat(String(p.price ?? '0'));
    setPriceRange(Number.isFinite(priceNum) ? priceNum : 0);
    setSizeSqft(parseSqftFromApi(p.size));
    setNumBeds(String(p.bedrooms ?? ''));
    setNumWashrooms(String(p.washrooms ?? ''));
    setAddress(String(p.address ?? ''));

    const pt = String(p.property_type ?? '');
    const idx = tabIndexForApiPropertyType(pt);
    setTabIndex(idx);
    const tabKeys = ['Home', 'Plot', 'Commercial'] as const;
    setPropertyType(tabKeys[idx] ?? 'Home');
    setSelectedPropertySubType(pt || null);

    const city = String(p.city ?? 'Islamabad').trim() || 'Islamabad';
    setLocations(prev => (prev.includes(city) ? prev : [...prev, city]));
    setSelectedLocations([city]);

    const urls = listPropertyImageUrls(p);
    if (urls.length > 0) {
      setCoverPhoto(urls[0]);
      setMultiImages(urls.slice(1).map(uri => ({ uri })));
    } else {
      setCoverPhoto(null);
      setMultiImages([]);
    }
  }, [route.params?.property, resetAddPropertyForm]);

  useEffect(() => {
    const pick = route.params?.pickedLocation as
      | { address: string; latitude: number; longitude: number }
      | undefined;
    if (!pick) {
      return;
    }
    const latOk =
      typeof pick.latitude === 'number' &&
      Number.isFinite(pick.latitude);
    const lngOk =
      typeof pick.longitude === 'number' &&
      Number.isFinite(pick.longitude);
    if (!latOk || !lngOk) {
      return;
    }
    if (pick.address?.trim()) {
      setAddress(pick.address.trim());
    }
    setMapLatLng({
      lat: pick.latitude.toFixed(6),
      lng: pick.longitude.toFixed(6),
    });
    navigation.setParams({ pickedLocation: undefined } as never);
  }, [route.params?.pickedLocation, navigation]);

  const headerTitle = editingPropertyId ? t('EditProperty') : t('AddProperty');

  const Header = ({ insets, title }: { insets: any; title: string }) => {
    return (
      <WelcomeHeader
        containerStyle={{
          paddingTop: insets?.top || heightPixel(5),
        }}
        name={title}
        hideProfile={true}
        profile={false}
      />
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <Header insets={insets} title={headerTitle} />;
      },
    });
  }, [insets, navigation, headerTitle]);
  const house = [
    { id: 1, name: t('House') },
    { id: 2, name: t('Flat') },
    { id: 3, name: t('UpperPortion') },
    { id: 4, name: t('LowerPortion') },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'Home':
        return (
          <View style={[dynamicStyles(colors)?.propertySubTypeWrapper]}>
            {house.map((item, index) => (
              <TouchableOpacity
                key={item?.id}
                style={[
                  dynamicStyles(colors)?.propertySubTypeButton,
                  selectedPropertySubType === item?.name &&
                    dynamicStyles(colors).propertySubTypeButtonActive,
                ]}
                onPress={() => setSelectedPropertySubType(item?.name)}
              >
                <CustomText
                  color={
                    selectedPropertySubType === item?.name
                      ? colors.white
                      : colors.black
                  }
                >
                  {item?.name}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'Plot':
        return (
          <View
            style={[
              appStyles?.flexRow,
              dynamicStyles(colors)?.propertySubTypeWrapper,
            ]}
          >
            {[
              { id: 1, name: t('Residential') },
              { id: 2, name: t('Commercial') },
            ].map((item, index) => (
              <TouchableOpacity
                key={item?.id}
                style={[
                  dynamicStyles(colors).propertySubTypeButton,
                  selectedPropertySubType === item?.name &&
                    dynamicStyles(colors).propertySubTypeButtonActive,
                ]}
                onPress={() => setSelectedPropertySubType(item?.name)}
              >
                <CustomText
                  color={
                    selectedPropertySubType === item?.name
                      ? colors.white
                      : colors.black
                  }
                >
                  {item?.name}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'Commercial':
        return (
          <View
            style={[
              appStyles?.flexRow,
              dynamicStyles(colors)?.propertySubTypeWrapper,
            ]}
          >
            {[
              { id: 1, name: t('Shop') },
              { id: 2, name: t('Office') },
              { id: 3, name: t('Warehouse') },
            ].map((item, index) => (
              <TouchableOpacity
                key={item?.id}
                style={[
                  dynamicStyles(colors).propertySubTypeButton,
                  selectedPropertySubType === item?.name &&
                    dynamicStyles(colors).propertySubTypeButtonActive,
                ]}
                onPress={() => setSelectedPropertySubType(item?.name)}
              >
                <CustomText
                  color={
                    selectedPropertySubType === item?.name
                      ? colors.white
                      : colors.black
                  }
                >
                  {item?.name}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const handleCreateProperty = async () => {
    if (!propertyTitle.trim()) {
      utility.showAlertMessage('danger', strings.enterPropertyTitle);
      return;
    }
    if (!address.trim()) {
      utility.showAlertMessage('danger', strings.enterPropertyAddress);
      return;
    }

    const formData = new FormData();
    formData.append('title', propertyTitle.trim());
    formData.append('description', description.trim() || '—');
    formData.append('price', Number(priceRange).toFixed(2));
    formData.append(
      'property_type',
      selectedPropertySubType || propertyType || 'Home',
    );
    formData.append('size', `${Math.round(sizeSqft)} sqft`);
    formData.append('city', selectedLocations[0] || 'Islamabad');
    formData.append('address', address.trim() || '—');
    formData.append('bedrooms', String(numBeds || '0'));
    formData.append('washrooms', String(numWashrooms || '0'));
    formData.append(
      'location_lat',
      Number(mapLatLng.lat).toFixed(6),
    );
    formData.append(
      'location_lng',
      Number(mapLatLng.lng).toFixed(6),
    );

    if (coverPhoto) {
      formData.append('uploaded_images', {
        uri: coverPhoto,
        type: 'image/jpeg',
        name: 'cover.jpg',
      } as any);
    }
    multiImages.forEach((img, i) => {
      const uri = img?.uri;
      if (uri) {
        formData.append('uploaded_images', {
          uri,
          type: 'image/jpeg',
          name: `property_${i}.jpg`,
        } as any);
      }
    });

    dispatch(showLoader());
    try {
      if (editingPropertyId) {
        await dispatch(
          updateProperty({ id: editingPropertyId, formData }),
        ).unwrap();
        utility.showAlertMessage(
          'success',
          strings.propertyUpdatedSuccessfully,
        );
      } else {
        await dispatch(createProperty(formData)).unwrap();
        utility.showAlertMessage('success', strings.propertyAddedSuccessfully);
      }
      navigation.goBack();
    } catch {
      // postFormDataService / patchFormDataService already surfaced via checkError
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <CustomScrollView
      contentStyle={{
        paddingBottom: 20,
      }}
    >
      <TouchableOpacity
        style={dynamicStyles(colors)?.uploadContainer}
        activeOpacity={0.8}
        onPress={() => setImagePickerVisible(true)}
      >
        {coverPhoto ? (
          <Image
            source={{ uri: coverPhoto }}
            style={dynamicStyles(colors)?.coverPhoto}
          />
        ) : (
          <>
            <Image
              source={icons.cloud}
              style={dynamicStyles(colors)?.cloudIcon}
            />
            <Text style={dynamicStyles(colors)?.uploadText}>
              {t('UploadImageVideo')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <ImagePickerModal
        visible={isImagePickerVisible}
        cropping
        setVisible={() => setImagePickerVisible(false)}
        onImageSelect={(image: any) => {
          setCoverPhoto(image.path);
          setImagePickerVisible(false);
        }}
      />

      <MultiImagePicker
        images={multiImages}
        onChange={setMultiImages}
        max={6}
      />

<View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          weight="medium"
          color={colors.primary}
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('EnterAddress')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate(screens.LocationPickerScreen, {
            initialAddress: address,
            initialLatitude: Number(mapLatLng.lat) || Number(DEFAULT_LOCATION_LAT),
            initialLongitude: Number(mapLatLng.lng) || Number(DEFAULT_LOCATION_LNG),
          })
        }
      >
        <CustomTextInput
          returnKeyType="next"
          autoCapitalize="none"
          rightIcon={icons.location}
          placeholderTextColor={colors.greish}
          placeholder={t('Enterpropertyaddress')}
          value={address}
          editable={false}
          pointerEvents="none"
          containerStyle={dynamicStyles(colors)?.textInputContainer}
        />
      </TouchableOpacity>

      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText color={colors.primary} fontSize={16} weight="medium">
          {t('PropertyTitle')}
        </CustomText>
        <CustomText color={colors?.red}>*</CustomText>
      </View>

      <CustomTextInput
        placeholder={t('EnterPropertyOwnerName')}
        containerStyle={dynamicStyles(colors)?.textInputContainer}
        value={propertyTitle}
        onChangeText={setPropertyTitle}
      />
      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          weight="medium"
          color={colors.primary}
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('IWantTo')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <View
        style={[appStyles.flexRow, dynamicStyles(colors)?.sellRentContainer]}
      >
        <TouchableOpacity
          style={[
            dynamicStyles(colors).sellRentButton,
            iWantTo === 'Sell' && dynamicStyles(colors)?.sellRentButtonActive,
          ]}
          onPress={() => setIWantTo('Sell')}
        >
          <CustomText
            weight="medium"
            color={colors.primary}
            style={[
              // dynamicStyles(colors).sellRentText,
              iWantTo === 'Sell' && dynamicStyles(colors)?.sellRentTextActive,
            ]}
          >
            {t('Sell')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            dynamicStyles(colors)?.sellRentButton,
            iWantTo === 'Rent' && dynamicStyles(colors)?.sellRentButtonActive,
          ]}
          onPress={() => setIWantTo('Rent')}
        >
          <CustomText
            color={colors.primary}
            style={[
              // dynamicStyles(colors).sellRentText,
              iWantTo === 'Rent' && dynamicStyles(colors)?.sellRentTextActive,
            ]}
          >
            {t('Rent')}
          </CustomText>
        </TouchableOpacity>
      </View>
      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText color={colors.primary} fontSize={16} weight="medium">
          {t('PropertyType')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <TabView
        renderScene={renderScene}
        style={{ minHeight: utility?.isPlatformIOS ? 200 : 200 }}
        onIndexChange={setTabIndex}
        navigationState={{ index: tabIndex, routes }}
        renderTabBar={props => (
          <CustomTabs
            {...props}
            selectedTab={tabIndex}
            onChangeTab={setTabIndex}
            tabStyle={(index: number) => ({
              borderBottomWidth: tabIndex === index ? 1.5 : 1,
              borderBottomColor:
                tabIndex === index ? colors.purple1 : colors.borderGrey,
            })}
          />
        )}
      />

      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(0),
          },
        ]}
      >
        <CustomText
          fontSize={16}
          weight="medium"
          color={colors.primary}
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('Location')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <View
        style={[
          appStyles.flexRow,
          dynamicStyles(colors)?.locationChipsContainer,
        ]}
      >
        {locations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={[
              dynamicStyles(colors)?.chip,
              selectedLocations?.includes(location) &&
                dynamicStyles(colors)?.selectedChip,
            ]}
            onPress={() => {
              if (selectedLocations?.includes(location)) {
                setSelectedLocations(
                  selectedLocations?.filter(loc => loc !== location),
                );
              } else {
                setSelectedLocations([...selectedLocations, location]);
              }
            }}
          >
            <CustomText
              color={
                selectedLocations?.includes(location)
                  ? colors.white
                  : colors.black
              }
              fontSize={15}
            >
              {location}
            </CustomText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={dynamicStyles(colors)?.addLocationButton}
          onPress={() => setShowLocationInput(!showLocationInput)}
        >
          <Image source={icons.plus} style={dynamicStyles(colors)?.addicon} />
        </TouchableOpacity>
      </View>
      {showLocationInput && (
        <CustomTextInput
          placeholder="Enter new location"
          value={newLocation}
          onChangeText={setNewLocation}
          onSubmitEditing={() => {
            if (newLocation?.trim() !== '') {
              setLocations([...locations, newLocation?.trim()]);
              setNewLocation('');
              setShowLocationInput(false);
            }
          }}
          containerStyle={dynamicStyles(colors).textInputContainer}
        />
      )}
      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          color={colors.primary}
          weight="medium"
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('PriceRange')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <Slider
        style={dynamicStyles(colors).slider}
        minimumValue={0}
        maximumValue={10000000}
        step={100000}
        value={priceRange}
        onValueChange={setPriceRange}
        minimumTrackTintColor={colors.purple1}
        maximumTrackTintColor={colors.greaytext}
        thumbTintColor={colors.purple1}
      />
      <CustomTextInput
        placeholder={t('EnterPrice')}
        value={priceRange.toString()}
        keyboardType="numeric"
        containerStyle={dynamicStyles(colors)?.textInputContainer}
      />

      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          color={colors.primary}
          weight="medium"
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('propertySize')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <Slider
        style={dynamicStyles(colors).slider}
        minimumValue={500}
        maximumValue={10000}
        step={100}
        value={sizeSqft}
        onValueChange={setSizeSqft}
        minimumTrackTintColor={colors.purple1}
        maximumTrackTintColor={colors.greaytext}
        thumbTintColor={colors.purple1}
      />
      <CustomTextInput
        placeholder={t('propertySize')}
        value={`${Math.round(sizeSqft)} sqft`}
        editable={false}
        containerStyle={dynamicStyles(colors)?.textInputContainer}
      />

      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          color={colors.primary}
          weight="medium"
          style={dynamicStyles(colors).inputLabel}
        >
          {t('BedsWashrooms')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <View
        style={[
          appStyles.flexRow,
          dynamicStyles(colors).bedsWashroomsContainer,
        ]}
      >
        <CustomTextInput
          placeholder={t('NoofBeds')}
          keyboardType="numeric"
          rightIcon={icons.bed}
          containerStyle={dynamicStyles(colors)?.bedsWashroomsInput}
          value={numBeds}
          onChangeText={setNumBeds}
        />
        <CustomTextInput
          placeholder={t('NoofWashrooms')}
          keyboardType="numeric"
          rightIcon={icons.toilet}
          containerStyle={dynamicStyles(colors).bedsWashroomsInput}
          value={numWashrooms}
          onChangeText={setNumWashrooms}
        />
      </View>
      <View
        style={[
          appStyles.flexRow,
          {
            marginTop: heightPixel(20),
            gap: 5,
          },
        ]}
      >
        <CustomText
          fontSize={16}
          weight="medium"
          color={colors.primary}
          style={dynamicStyles(colors)?.inputLabel}
        >
          {t('Description')}
        </CustomText>
        <CustomText color={colors?.red}>*</CustomText>
      </View>

      <CustomTextInput
        placeholder={t('Writeherepropertydetails')}
        multiline
        numberOfLines={5}
        containerStyle={dynamicStyles(colors)?.descriptionInputContainer}
        inputFieldStyle={dynamicStyles(colors)?.descriptionInput}
        value={description}
        onChangeText={setDescription}
      />


      {/* <CustomText
        fontSize={12}
        color={colors.greish}
        style={{ marginTop: heightPixel(6), marginLeft: widthPixel(2) }}
      >
        {`Lat ${Number(mapLatLng.lat).toFixed(6)} · Lng ${Number(mapLatLng.lng).toFixed(6)}`}
      </CustomText> */}

      <CustomButton
        gradient
        title={editingPropertyId ? t('saveChanges') : t('AddProperty')}
        onPress={handleCreateProperty}
      />
    </CustomScrollView>
  );
}

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    uploadContainer: {
      height: heightPixel(180),
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors?.purple1,
      borderRadius: widthPixel(10),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: heightPixel(20),
    },
    addicon: {
      height: heightPixel(22),
      width: widthPixel(15),
      resizeMode: 'contain',
      tintColor: colors?.primary,
    },
    cloudIcon: {
      width: widthPixel(50),
      height: heightPixel(50),
      tintColor: colors?.purple1,
    },
    uploadText: {
      color: colors?.gray,
      marginTop: heightPixel(10),
    },
    coverPhoto: {
      width: '100%',
      height: '100%',
      borderRadius: widthPixel(10),
      resizeMode: 'cover',
    },
    inputLabel: {},
    textInputContainer: {
      marginTop: heightPixel(5),
    },
    sellRentContainer: {
      marginTop: heightPixel(10),
      justifyContent: 'space-between',
    },
    sellRentButton: {
      width: widthPixel(165),
      height: heightPixel(50),
      borderRadius: widthPixel(10),
      backgroundColor: colors?.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sellRentButtonActive: {
      backgroundColor: colors?.purple1,
    },
    sellRentTextActive: {
      color: colors?.white,
    },
    locationChipsContainer: {
      marginTop: heightPixel(10),
      flexWrap: 'wrap',
      gap: widthPixel(10),
    },
    chip: {
      backgroundColor: colors?.white,
      borderRadius: widthPixel(20),
      paddingVertical: heightPixel(8),
      paddingHorizontal: widthPixel(15),
      borderWidth: 1,
      borderColor: colors?.borderGrey,
    },
    selectedChip: {
      backgroundColor: colors?.purple1,
      borderColor: colors?.purple1,
    },
    chipText: {
      color: colors?.black,
      fontSize: 14,
    },
    addLocationButton: {
      backgroundColor: colors?.white,
      borderRadius: widthPixel(20),
      paddingVertical: heightPixel(8),
      paddingHorizontal: widthPixel(15),
      justifyContent: 'center',
      alignItems: 'center',
    },
    propertyTypeContainer: {
      marginTop: heightPixel(10),
      justifyContent: 'space-between',
    },
    propertyTypeButton: {
      width: widthPixel(105),
      height: heightPixel(50),
      borderRadius: widthPixel(10),
      borderWidth: 1,
      borderColor: colors?.purple1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    propertyTypeButtonActive: {
      backgroundColor: colors?.purple1,
    },
    propertyTypeText: {
      color: colors?.black,
      fontSize: 16,
      fontWeight: 'bold',
    },
    propertyTypeTextActive: {
      color: colors.white,
    },
    propertySubTypeButton: {
      width: widthPixel(165),
      height: heightPixel(50),
      flexDirection: 'row',
      borderRadius: widthPixel(10),
      borderWidth: 1,
      borderColor: colors?.white,
      backgroundColor: colors?.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: heightPixel(5),
    },
    propertySubTypeButtonActive: {
      backgroundColor: colors?.purple1,
    },
    propertySubTypeText: {
      color: colors?.black,
      fontSize: 16,
      fontWeight: 'bold',
    },
    propertySubTypeTextActive: {
      color: colors?.white,
    },
    propertySubTypeWrapper: {
      flexWrap: 'wrap',
      marginTop: heightPixel(10),
      gap: widthPixel(10),
      marginHorizontal: widthPixel(0),
    },
    sliderContainer: {
      marginHorizontal: widthPixel(20),
      marginTop: heightPixel(20),
      height: heightPixel(20),
      justifyContent: 'center',
    },
    track: {
      height: heightPixel(4),
      backgroundColor: colors?.greaytext,
      borderRadius: heightPixel(2),
      width: '100%',
    },
    thumb: {
      position: 'absolute',
      width: widthPixel(20),
      height: widthPixel(20),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: widthPixel(10),
      backgroundColor: colors?.purple1,
    },
    bedsWashroomsContainer: {
      justifyContent: 'space-between',
    },
    bedsWashroomsInput: {
      width: widthPixel(165),
      marginTop: 10,
    },
    descriptionInputContainer: {
      marginTop: heightPixel(10),
      height: heightPixel(120),
      marginBottom: heightPixel(20),
      alignItems: 'flex-start',
    },
    descriptionInput: {
      height: '100%',
      textAlignVertical: 'top',
      paddingTop: heightPixel(10),
    },
    slider: {
      marginTop: heightPixel(20),
    },
  });
