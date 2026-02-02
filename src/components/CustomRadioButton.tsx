import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import IconButton from './IconButton';
import { icons, colors } from '../utilities';
import { heightPixel } from '../utilities/helpers';

interface CustomRadioButtonProps {
  label: string;
  sublabel: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: any;
  useGradient?: boolean;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  isSelected,
  onPress,
  sublabel,
  icon,
  useGradient = false,
}) => {
  const RadioButtonContent = () => (
    <View
      style={[
        styles.container,
        { backgroundColor: isSelected ? colors.black : colors.white },
      ]}
    >
      <View style={styles.labelContainer}>
        <View
          style={[
            styles.labelContainer,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}

          {isSelected && (
            <IconButton onPress={() => {}} size={23} icon={icons.selected} />
          )}
        </View>
        <View>
          <CustomText
            fontSize={22}
            weight="bold"
            color={isSelected ? colors.white : colors.black}
            style={styles.label}
          >
            {label}
          </CustomText>
          <CustomText
            fontSize={12}
            weight="regular"
            color={isSelected ? colors.white : colors.black}
            style={styles.label}
          >
            {sublabel}
          </CustomText>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <RadioButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:15,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gradientContainer: {
    borderRadius: 10,
    padding: 1,
  },
  selectedContainer: {
    // borderColor: colors.primary,
  },
  labelContainer: {
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    maxWidth: 300,
    marginBottom: heightPixel(5),
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  selectedRadio: {
    backgroundColor: colors.white,
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomRadioButton;
