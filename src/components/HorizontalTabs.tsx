import React, { FC, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { HorizontalTabsProps } from '../interface';
import CustomText from './CustomText';
import { getShadows, getAppStyles } from '../utilities';
import { useTheme } from '../hooks';

const HorizontalTabs: FC<HorizontalTabsProps> = ({
  tabs = [],
  onPressTab,
  multiSelect = false,
}) => {
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const shadows = getShadows(isDarkMode);

  const flatListRef = useRef<FlatList>(null);
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);

  const onSelectTab = (
    tab: { label: string; image?: ImageSourcePropType },
    index: number,
  ) => {
    if (multiSelect) {
      const updatedSelectedTabs = selectedTabs.includes(tab.label)
        ? selectedTabs.filter(item => item !== tab.label)
        : [...selectedTabs, tab.label];
      setSelectedTabs(updatedSelectedTabs);
      onPressTab?.(updatedSelectedTabs);
    } else {
      setSelectedTabs([tab.label]);
      flatListRef?.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });
      onPressTab?.(tab.label);
    }
  };

  return (
    <View style={dynamicStyles(colors).wrapper}>
      <FlatList
        horizontal
        data={tabs}
        bounces={true}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={dynamicStyles(colors).contentContainer}
        renderItem={({ item, index }) => {
          const isSelected = selectedTabs.includes(item.label);

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => onSelectTab(item, index)}
              style={[
                dynamicStyles(colors).tabContainer,
                isSelected && {
                  borderWidth: 1.5,
                  borderColor: colors.purple2,
                },
                !isSelected && { backgroundColor: colors.white },
              ]}
            >
              {isSelected ? (
                <LinearGradient
                  colors={[colors.purple1, colors.purple2]}
                  start={{ x: 0.0, y: 1.0 }}
                  end={{ x: 0.8, y: 0.5 }}
                  style={dynamicStyles(colors).selectedTabGradient}
                >
                  {item.image && (
                    <Image
                      source={item.image}
                      style={dynamicStyles(colors).selectedTabImage}
                      // tintColor={colors.white}
                    />
                  )}
                  <CustomText
                    fontSize={12}
                    weight={'bold'}
                    color={colors.white}
                  >
                    {item.label}
                  </CustomText>
                </LinearGradient>
              ) : (
                <>
                  {item.image && (
                    <Image
                      source={item.image}
                      style={dynamicStyles(colors).tabImage}
                    />
                  )}
                  <CustomText
                    fontSize={12}
                    weight={'medium'}
                    color={colors.black}
                  >
                    {item.label}
                  </CustomText>
                </>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    wrapper: {},
    contentContainer: {
      alignItems: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      marginRight: widthPixel(12),
      borderRadius: heightPixel(40),
      // ...getShadows(false).shadow3,
    },

    selectedTabGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: widthPixel(12),
      paddingVertical: heightPixel(5),
      borderRadius: heightPixel(40),
    },
    tabImage: {
      width: widthPixel(28),
      height: heightPixel(28),
      marginRight: widthPixel(8),
      borderRadius: widthPixel(12),
    },
    selectedTabImage: {
      width: widthPixel(28),
      height: heightPixel(28),
      marginRight: widthPixel(8),
      // tintColor: colors.white,
    },
  });

export default HorizontalTabs;
