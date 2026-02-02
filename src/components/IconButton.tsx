import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, pop} from '../utilities';
import {IiconButton} from '../interface';

const IconButton: FC<IiconButton> = ({
  icon,
  size,
  onPress,
  tintColor,
  iconStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, iconStyle]}
      onPress={() => (onPress ? onPress() : pop())}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={tintColor}
        style={{
          width: size || 15,
          height: size || 15,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    // borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: colors.borderGrey,
  },
});

export default IconButton;
