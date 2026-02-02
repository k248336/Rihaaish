import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { appStyles, colors } from '../../utilities';
import CustomText from '../../components/CustomText';
import { CustomScrollView } from '../../components';
import { heightPixel } from '../../utilities/helpers';

const PrivacyPolicy = () => {
  return (
    <CustomScrollView contentStyle={[styles.container]}>
      <CustomText
        style={{
          marginTop: heightPixel(10),
        }}
        fontSize={14}
        color={colors.black}
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </CustomText>
      <CustomText fontSize={14} color={colors.black}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </CustomText>

      <CustomText fontSize={14} color={colors.black}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </CustomText>
      <CustomText fontSize={14}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </CustomText>
    </CustomScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: heightPixel(20),
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default PrivacyPolicy;
