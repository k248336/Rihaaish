import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  getAppStyles,
  getShadows,
  icons,
  images,
  pop,
  utility,
} from '../../../utilities';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import CustomScrollView from '../../../components/CustomScrollView';
import CustomButton from '../../../components/CustomButton';
import PhoneTextInput from '../../../components/PhoneTextInput';
import CustomTextInput from '../../../components/CustomTextInput';
import useEditProfileControllers from '../../../controllers/UserControllers/EditProfileControllers';
import { useAppSelector, useTheme } from '../../../hooks';
import {
  CustomText,
  FastImageComp,
  ImagePickerModal,
  DatePicker,
} from '../../../components';
import { useTranslation } from '../../../utilities/translations';

const EditProfile = () => {
  const { colors } = useTheme();
  const { values, functions } = useEditProfileControllers();
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const { t } = useTranslation();

  return (
    <CustomScrollView contentStyle={{ paddingBottom: 20 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => functions.togglePickerModal()}
        style={dynamicStyles(colors).profileImageContainer}
      >
        <Image
          style={dynamicStyles(colors).profileImage}
          source={
            values.image !== '' ? { uri: values.image } : images.dummyAvatar
          }
        />
        <View style={dynamicStyles(colors).cameracontainer}>
          <Image
            resizeMode="contain"
            source={icons.camera}
            style={{ height: 12, width: 15 }}
            // tintColor={colors.black}
          />
        </View>
      </TouchableOpacity>

      <Formik
        initialValues={{
          ...values.initialValues,
          dob: values.initialValues.dob || '',
        }}
        validationSchema={values.schema}
        // onSubmit={functions.handleEditProfile}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values: data,
          errors,
          touched,
        }) => (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                label={t('FullName')}
                icon={icons.gradientuser}
                rightIconSize={20}
                returnKeyType="next"
                placeholder={t('FullName')}
                placeholderTextColor={colors.greish}
                onChangeText={handleChange('firstname')}
                value={data.firstname}
                onBlur={handleBlur('firstname')}
                errors={errors.firstname}
                focus={touched.firstname}
              />

              <CustomTextInput
                returnKeyType="next"
                autoCapitalize="none"
                icon={icons.email}
                rightIconSize={20}
                label={t('emailAddress')}
                editable={false}
                placeholderTextColor={colors.greish}
                keyboardType="email-address"
                placeholder={t('Enteryouremail')}
                onChangeText={handleChange('email')}
                value={data.email}
                errors={errors.email}
                focus={touched.email}
              />
              <PhoneTextInput
                label={t("PhoneNumber")}
                placeholder={t("EnteryourPhoneNumber")}
                value={data.mobile_no}
                setValue={handleChange('mobile_no')}
                errors={errors.mobile_no}
                focus={touched.mobile_no}
                setCountryCode={handleChange('mobile_code')}
              />
              <DatePicker
                label={t("DateofBirth")}
                mode="date"
                placeholder="DOB"
                value={data.dob}
                onDateChange={date => {
                  handleChange('dob')(date);
                }}
              />
              <CustomTextInput
                label={t("Location")}
                returnKeyType="next"
                rightIconSize={20}
                icon={icons.gradientlocation}
                autoCapitalize="none"
                placeholderTextColor={colors.greish}
                placeholder={t("Location")}
                onChangeText={handleChange('location')}
                value={data.location}
                errors={errors.location}
                focus={touched.location}
              />
            </View>

            <CustomButton
              gradient
              title={t("saveChanges")}
              btnStyle={dynamicStyles(colors).btnStyle}
              // onPress={handleSubmit}
              onPress={() => pop()}
            />
          </View>
        )}
      </Formik>

      <ImagePickerModal
        key={'imagePicker'}
        mediaType="photo"
        visible={values.imgPickerModal}
        setVisible={() => functions.togglePickerModal()}
        onImageSelect={img => {
          if (Array.isArray(img)) {
            functions.setImage(img[0]?.path);
          } else {
            functions.setImage(img?.path);
          }
        }}
      />
    </CustomScrollView>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    bottomText: {
      textAlign: 'center',
      marginTop: heightPixel(25),
      marginHorizontal: widthPixel(16),
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: widthPixel(12),
      paddingTop: heightPixel(12),
    },
    icon: {
      height: heightPixel(13),
      width: widthPixel(13),
      resizeMode: 'contain',
    },
    chip: {
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: widthPixel(5),
      paddingVertical: heightPixel(8),
      paddingHorizontal: widthPixel(10),
      marginRight: 8,
      marginBottom: 8,
    },
    animatedCheckBoxContainer: {
      marginHorizontal: 5,
      marginTop: heightPixel(28),
    },
    cameracontainer: {
      height: heightPixel(30),
      borderRadius: heightPixel(40),
      width: widthPixel(30),
      position: 'absolute',
      left: 70,
      top: 70,
      backgroundColor: colors.halfWhite,
      ...getShadows(false).shadow5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnStyle: {
      // alignSelf: 'center',
      // width: widthPixel(342),
    },
    flexrow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    containerStyle: {},
    profileImageContainer: {
      alignItems: 'center',
      borderWidth: 1,
      alignSelf: 'center',
      borderRadius: 60,
      borderColor: colors.activetab,
      borderStyle: 'dashed',
      marginBottom: heightPixel(20),
      marginTop: heightPixel(10),
    },
    profileImage: {
      width: widthPixel(100),
      height: heightPixel(100),
      borderRadius: widthPixel(60),
      // marginBottom: heightPixel(10),
    },
    profilePlaceholderText: {
      fontStyle: 'italic',
    },
    appLogoStyle: {
      width: widthPixel(100),
      height: heightPixel(100),
      marginTop: heightPixel(utility.isPlatformIOS ? 0 : 90),

      // marginBottom: heightPixel(35),
      alignSelf: 'center',
    },
  });

export default EditProfile;
