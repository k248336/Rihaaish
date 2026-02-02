import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import {
  CustomButton,
  CustomScrollView,
  WelcomeHeader,
  CustomTabs,
} from '../../../components';
import { getAppStyles, getShadows, icons, utility } from '../../../utilities';
import { ImagePickerModal } from '../../../components/modals';
import { CustomText, CustomTextInput } from '../../../components';
import MultiImagePicker from '../../../components/MultiImagePicker';
import { TabView } from 'react-native-tab-view';
import { useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';

export default function AddProperty() {
  const navigation = useNavigation();
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

  const Header = ({ insets }: { insets: any }) => {
    return (
      <WelcomeHeader
        containerStyle={{
          paddingTop: insets?.top || heightPixel(5),
        }}
        name={t('AddProperty')}
        hideProfile={true}
        profile={false}
      />
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return <Header insets={insets} />;
      },
    });
  }, [insets, navigation]);
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

  const generatePayload = () => {
    const payload = {
      coverPhoto: coverPhoto,
      multiImages: multiImages.map(img => img?.uri),
      iWantTo: iWantTo,
      selectedLocations: selectedLocations,
      propertyType: propertyType,
      propertySubType: selectedPropertySubType,
      priceRange: priceRange,
      propertyTitle: propertyTitle,
      numBeds: parseInt(numBeds),
      numWashrooms: parseInt(numWashrooms),
      description: description,
      address: address,
    };
    console.log('Generated Payload:', payload);
    return payload;
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
          {t('EnterAddress')}
        </CustomText>
        <CustomText color={colors.red}>*</CustomText>
      </View>

      <CustomTextInput
        placeholder={t('Enterpropertyaddress')}
        containerStyle={dynamicStyles(colors)?.textInputContainer}
        value={address}
        onChangeText={setAddress}
      />
      <CustomButton
        gradient
        title={t('AddProperty')}
        onPress={generatePayload}
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
