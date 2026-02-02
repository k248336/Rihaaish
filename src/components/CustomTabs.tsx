import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomTabsProps} from '../interface';
import {heightPixel} from '../utilities/helpers';
import CustomText from './CustomText';
import { useTheme } from '../hooks';

const CustomTabs: FC<CustomTabsProps> = ({
  tabStyle,
  titleSize,
  selectedTab,
  onChangeTab,
  containerStyle,
  navigationState,
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {navigationState?.routes?.map(
        (item: {title: string; icon?: any}, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => onChangeTab(index)}
            style={[
              styles.tabView,
              tabStyle,
              {
                borderBottomWidth: selectedTab === index ? 1.5 : 1,
                borderBottomColor:
                  selectedTab === index ? colors.purple1 : colors.borderGrey,
              },
            ]}>
            {item?.icon && (
              <Image
                resizeMode="contain"
                source={item.icon}
                style={styles.iconStyle}
              />
            )}

            <CustomText
              weight="semibold"
              fontSize={titleSize || 14}
              color={selectedTab === index ? colors.purple1 : colors.textGrey}>
              {item.title}
            </CustomText>
          </TouchableOpacity>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightPixel(10),
  },
  tabView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(5),
  },
  iconStyle: {
    width: heightPixel(18),
    height: heightPixel(18),
    marginBottom: heightPixel(5),
  },
});

export default CustomTabs;
