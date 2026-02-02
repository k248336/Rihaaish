// import { Formik } from 'formik';
// import React, { useState } from 'react';
// import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { getColors, icons, utility, getAppStyles } from '../../utilities';
// import { AuthSchema } from '../../models';
// import { heightPixel, widthPixel } from '../../utilities/helpers';

// import CustomScrollView from '../../components/CustomScrollView';
// import {
//   CustomText,
//   FastImageComp,
//   HeadingComp,
//   ImagePickerModal,
// } from '../../components';
// import CustomButton from '../../components/CustomButton';
// import CustomTextInput from '../../components/CustomTextInput';
// import { useCompleteProfileControllers } from '../../controllers';
// import { useFocusEffect } from '@react-navigation/native';
// import { useAppSelector, useTheme } from '../../hooks';
// export default function CompleteProfile() {
//   const { values, functions } = useCompleteProfileControllers();
//   const maxValue = 10;
//   const [currentValue, setCurrentValue] = useState(0);
//   const { userInfo } = useAppSelector(state => state?.auth);

//   const { colors, isDarkMode } = useTheme();
//   const appStyles = getAppStyles(isDarkMode);

//   useFocusEffect(
//     React.useCallback(() => {
//       setCurrentValue(0);

//       const timeout = setTimeout(() => {
//         setCurrentValue(1);
//       }, 300);

//       return () => clearTimeout(timeout);
//     }, []),
//   );
//   return (
//     <CustomScrollView backgroundStyle={{ backgroundColor: colors.background }}>
//       <HeadingComp
//         title="Create Your Profile"
//         subTitle={`experience our Learning`}
//         titleTxtSize={22}
//         subTitleTxtSize={14}
//         titleTxtColor={colors.primary}
//         subTitleTxtColor={colors.greaytext}
//         titletxtWeight="bold"
//         subTitleTxtWeight="regular"
//         containerStyle={dynamicStyles(colors).containerStyle}
//       />
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => functions.togglePickerModal()}
//         style={dynamicStyles(colors).profileImageContainer}
//       >
//         {values.image ? (
//           <FastImageComp style={dynamicStyles(colors).profileImage} source={values.image} />
//         ) : values.userInfo?.image_url ? (
//           <FastImageComp
//             style={dynamicStyles(colors).profileImage}
//             source={values.userInfo.image_url}
//           />
//         ) : (
//           <Image
//             resizeMode="contain"
//             source={icons.add}
//             style={{
//               width: widthPixel(40),
//               height: heightPixel(40),
//               borderRadius: 100,
//               tintColor: colors.primary,
//             }}
//           />
//         )}
//       </TouchableOpacity>

//       {values.image || values.userInfo?.image_url ? (
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => functions.removeImage?.()}
//           style={dynamicStyles(colors).photoActionBtn}
//         >
//           <CustomText color={colors.red}>Remove Photo</CustomText>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => functions.togglePickerModal()}
//           style={dynamicStyles(colors).photoActionBtn}
//         >
//           <CustomText color={colors.primary}>Upload Photo</CustomText>
//         </TouchableOpacity>
//       )}

//       <Formik
//         initialValues={values.initialValues}
//         validationSchema={AuthSchema.CompleteProfileSchema}
//         onSubmit={functions.handleCompleteProfile}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values: data,
//           errors,
//           touched,
//         }) => (
//           <View style={{ flex: 1 }}>
//             <View style={{ flex: 1 }}>
//               <CustomTextInput
//                 label="Bio"
//                 multiline
//                 placeholder="Write something about you"
//                 onChangeText={handleChange('bio')}
//                 onBlur={handleBlur('bio')}
//                 value={data.bio}
//                 errors={errors.bio}
//                 focus={touched.bio}
//               />

//               <View style={dynamicStyles(colors).flexrow}>
//                 <CustomTextInput
//                   label="Country"
//                   returnKeyType="next"
//                   placeholder="Country"
//                   placeholderTextColor={colors.greaytext}
//                   containerStyle={{ width: widthPixel(170) }}
//                   onChangeText={handleChange('country')}
//                   value={data.country}
//                   onBlur={handleBlur('country')}
//                   errors={errors.country}
//                   focus={touched.country}
//                 />
//                 <CustomTextInput
//                   label="City"
//                   returnKeyType="next"
//                   placeholder="City"
//                   placeholderTextColor={colors.greaytext}
//                   containerStyle={{ width: widthPixel(170) }}
//                   onChangeText={handleChange('city')}
//                   value={data.city}
//                   onBlur={handleBlur('city')}
//                   errors={errors.city}
//                   focus={touched.city}
//                 />
//               </View>

//               <CustomTextInput
//                 label="Location"
//                 returnKeyType="next"
//                 autoCapitalize="none"
//                 placeholderTextColor={colors.greaytext}
//                 placeholder="Location"
//                 onChangeText={handleChange('location')}
//                 value={data.location}
//                 errors={errors.location}
//                 focus={touched.location}
//               />
//             </View>

//             <CustomButton
//               title="Save & Continue"
//               btnStyle={dynamicStyles(colors).btnStyle}
//               onPress={functions.navigateToScreen}
//             />
//           </View>
//         )}
//       </Formik>
//       <ImagePickerModal
//         key={'imagePicker'}
//         mediaType="photo"
//         visible={values.imgPickerModal}
//         setVisible={() => functions.togglePickerModal()}
//         onImageSelect={img => {
//           if (Array.isArray(img)) {
//             functions.setImage(img[0]?.path);
//           } else {
//             functions.setImage(img?.path);
//           }
//         }}
//       />
//     </CustomScrollView>
//   );
// }

// const dynamicStyles = (colors: any) => StyleSheet.create({
//   bottomText: {
//     textAlign: 'center',
//     marginTop: heightPixel(25),
//     marginHorizontal: widthPixel(16),
//   },
//   animatedCheckBoxContainer: {
//     marginHorizontal: 5,
//     marginTop: heightPixel(28),
//   },
//   cameracontainer: {
//     height: heightPixel(30),
//     borderRadius: heightPixel(40),
//     width: widthPixel(30),
//     position: 'absolute',
//     right: 130,
//     top: 75,
//     backgroundColor: colors.black,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnStyle: {
//     alignSelf: 'center',
//     width: widthPixel(342),
//   },
//   flexrow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   containerStyle: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     marginBottom: heightPixel(10),
//     marginTop: heightPixel(10),
//   },
//   profileImageContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     width: widthPixel(100),
//     height: heightPixel(100),
//     borderRadius: widthPixel(60),
//     borderColor: colors.borderGrey,
//     alignSelf: 'center',
//     marginBottom: heightPixel(10),
//     marginTop: heightPixel(10),
//   },
//   profileImage: {
//     width: widthPixel(100),
//     height: heightPixel(100),
//     borderRadius: widthPixel(100),
//   },
//   profilePlaceholderText: {
//     fontStyle: 'italic',
//   },
//   appLogoStyle: {
//     width: widthPixel(100),
//     height: heightPixel(100),
//     marginTop: heightPixel(utility.isPlatformIOS ? 0 : 90),
//     alignSelf: 'center',
//   },
//   photoActionBtn: {
//     alignSelf: 'center',
//   },
//   uploadBtn: {
//     width: widthPixel(160),
//   },
//   removeBtn: {
//     width: widthPixel(160),
//     backgroundColor: colors.danger,
//   },
// });
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CustomScrollView, HeadingComp } from '../../components';
import { useTheme } from '../../hooks';

export default function CompleteProfile() {
    const { colors, isDarkMode } = useTheme();

  return (
    <CustomScrollView>
      <HeadingComp
        title="Create Your Profile"
        subTitle={`experience our Learning`}
        titleTxtSize={22}
        subTitleTxtSize={14}
        titleTxtColor={colors.primary}
        subTitleTxtColor={colors.greaytext}
        titletxtWeight="bold"
        subTitleTxtWeight="regular"
        // containerStyle={dynamicStyles(colors).containerStyle}
      />
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({});
