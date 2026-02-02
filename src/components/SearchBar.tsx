import React, { FC, useState } from 'react';
import { Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { font, heightPixel, widthPixel } from '../utilities/helpers';
import { fontFamily, getAppStyles, getShadows, icons } from '../utilities';
import { ISearchBar } from '../interface';
import { useTheme } from '../hooks';

const SearchBar: FC<ISearchBar> = props => {
  const {
    value,
    onChangeText,
    onPress,
    onPressFilter,
    placeholder,
    containerStyle,
    filter,
    ...rest
  } = props;

  // const [searchText, setSearchText] = useState('');

  const onPressClear = () => {
    // setSearchText('');
    onChangeText?.('');
  };
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      onPress={onPress}
      style={[dynamicStyles(colors).container, containerStyle]}
    >
      <Image
        resizeMode="contain"
        source={icons.searchtab}
        style={[
          dynamicStyles(colors).iconStyle,
          {
            width: heightPixel(13),
            height: heightPixel(13),
          },
        ]}
      />

      <TextInput
        value={value}
        onPressIn={onPress}
        editable={!onPress}
        returnKeyType="search"
        onChangeText={onChangeText}
        placeholderTextColor={colors.gray}
        placeholder={placeholder || 'Search people..'}
        style={[dynamicStyles(colors).textInputStyle]}
        {...rest}
      />

      {filter && (
        <TouchableOpacity activeOpacity={0.7} onPress={onPressFilter}>
          <Image
            resizeMode="contain"
            source={icons.ai}
            style={dynamicStyles(colors).iconStyle}
          />
        </TouchableOpacity>
      )}

      {/* {(value !== '' || searchText !== '') && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressClear}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}>
          <Image
            resizeMode="contain"
            source={icons.cross}
            style={[styles.crossIconStyle, {tintColor: colors.greish}]}
          />
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      // marginBottom: 10,
      flexDirection: 'row',
    ...getShadows(false).shadow3,
      alignItems: 'center',
      marginTop: heightPixel(5),
      marginBottom: heightPixel(10),
      borderRadius: heightPixel(12),
      paddingVertical: widthPixel(3),
      paddingHorizontal: widthPixel(15),
      backgroundColor: colors.background,
    },
    iconStyle: {
      width: heightPixel(20),
      height: heightPixel(20),
    },
    crossIconStyle: {
      width: heightPixel(12),
      height: heightPixel(12),
    },
    textInputStyle: {
      flex: 1,
      height: 45,
      padding: 0,
      color: colors.gray,
      marginHorizontal: 10,
      fontSize: font(12),
      // fontFamily: fontFamily.Gilroy.regular,
    },
  });

export default SearchBar;
