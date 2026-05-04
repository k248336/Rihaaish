import React, { FC, useState } from 'react';
import { Image, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import { font, heightPixel, widthPixel } from '../utilities/helpers';
import { getShadows, icons } from '../utilities';
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
  const { colors } = useTheme();
  const containerCombined = [dynamicStyles(colors).container, containerStyle];
  const useViewRoot = Boolean(onChangeText);

  const inner = (
    <>
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
    </>
  );

  if (useViewRoot) {
    return <View style={containerCombined}>{inner}</View>;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      onPress={onPress}
      style={containerCombined}
    >
      {inner}
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
