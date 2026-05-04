import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CustomButton,
  CustomScrollView,
  CustomTextInput,
} from '../../../components';
import { ChangePasswordSchema } from '../../../models';
import useChangePasswordController from '../../../controllers/SettingController/ChangePasswordController';
import { heightPixel } from '../../../utilities/helpers';
import { icons } from '../../../utilities';
import { useTheme } from '../../../hooks';
import { useTranslation } from '../../../utilities/translations';

export default function ChangePassword() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { values, functions } = useChangePasswordController();

  return (
    <CustomScrollView
      contentStyle={styles.scroll}
      backgroundStyle={{ backgroundColor: colors.red }}
    >
      <Formik
        initialValues={values.initialValues}
        validationSchema={ChangePasswordSchema.ChangePasswordSchema}
        onSubmit={functions.handleOnSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values: data,
          errors,
          touched,
        }) => (
          <View>
            <CustomTextInput
              autoCapitalize="none"
              autoCorrect={false}
              passwordField
              label={t('currentPasswordLabel')}
              placeholder={t('currentPasswordPlaceholder')}
              returnKeyType="next"
              icon={icons.lock}
              onChangeText={handleChange('currentpassword')}
              value={data.currentpassword}
              onBlur={handleBlur('currentpassword')}
              errors={errors.currentpassword as string}
              focus={touched.currentpassword}
            />
            <CustomTextInput
              autoCapitalize="none"
              autoCorrect={false}
              passwordField
              label={t('newPassword')}
              placeholder={t('newPassword')}
              returnKeyType="next"
              icon={icons.lock}
              onChangeText={handleChange('newpassword')}
              value={data.newpassword}
              onBlur={handleBlur('newpassword')}
              errors={errors.newpassword as string}
              focus={touched.newpassword}
            />
            <CustomTextInput
              autoCapitalize="none"
              autoCorrect={false}
              passwordField
              label={t('confirmPasswordLabel')}
              placeholder={t('confirmPasswordPlaceholder')}
              returnKeyType="done"
              icon={icons.lock}
              onChangeText={handleChange('confirmpassword')}
              value={data.confirmpassword}
              onBlur={handleBlur('confirmpassword')}
              errors={errors.confirmpassword as string}
              focus={touched.confirmpassword}
            />
            <CustomButton
              gradient
              title={t('saveChanges')}
              // btnStyle={styles.btn}
              onPress={() => handleSubmit()}
            />
          </View>
        )}
      </Formik>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: heightPixel(24),
    paddingTop: heightPixel(12),
  },
  btn: {
    marginTop: heightPixel(24),
    height: heightPixel(50),
  },
});
