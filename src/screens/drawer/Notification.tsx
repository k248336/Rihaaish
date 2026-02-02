import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CustomFlatlist, CustomScrollView, CustomText } from '../../components';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { colors, icons } from '../../utilities';

export default function Notification() {
  const notificationData = [
    { id: 1, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 2, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 3, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 4, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 5, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 6, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 7, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
    { id: 8, title: 'New appointment', description: 'Advisor: Madelyn Levin' },
  ];
  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View style={styles.bellcontainer}>
          <Image
            source={icons.notificationIcon}
            style={styles.notificationicon}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <CustomText weight="bold" color={colors.black}>
              {item.title}
            </CustomText>
            <CustomText fontSize={12} weight="regular" color={colors.black}>
              Now
            </CustomText>
          </View>

          <CustomText color={colors.black}>{item.description}</CustomText>
        </View>
      </View>
    );
  };
  return (
    <CustomScrollView>
      <CustomFlatlist
        data={notificationData}
        renderItem={renderItem}
        customStyle={{ marginTop: heightPixel(10) }}
        contentContainerStyle={{}}
      />
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  notificationicon: {
    height: heightPixel(20),
    width: widthPixel(20),
    resizeMode: 'contain',
  },
  bellcontainer: {
    backgroundColor: '#989898',
    height: heightPixel(47),
    width: widthPixel(47),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  container: {
    height: heightPixel(77),
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: 'center',
    gap: widthPixel(5),
    flexDirection: 'row',

    backgroundColor: colors.textfieldcolor,
  },
});
