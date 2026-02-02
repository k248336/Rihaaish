import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { getAppStyles, getColors, goBack } from '../../../utilities';
import CustomText from '../../../components/CustomText';
import { CustomButton, CustomScrollView } from '../../../components';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useTheme } from '../../../hooks';

const AboutUs = () => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <View style={appStyles.container}>
      <CustomScrollView contentStyle={[dynamicStyles(colors).container]} backgroundStyle={{backgroundColor: colors.background}}>
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
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </CustomText>
        <CustomText fontSize={14} color={colors.black}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </CustomText>

        <CustomText fontSize={14} color={colors.black}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </CustomText>
        <CustomText fontSize={14} color={colors.black}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </CustomText>
      </CustomScrollView>
      {/* <CustomButton
        onPress={() => {
          goBack();
        }}
        gradient
        title="I Accept"
        btnStyle={{
        //   paddingBottom: 20,
          width: widthPixel(343),
            alignSelf: 'center',
            marginBottom: 10,
        }}
      /> */}
    </View>
  );
};

const dynamicStyles = (colors: any) => StyleSheet.create({
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

export default AboutUs;
