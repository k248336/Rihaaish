import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomText from './CustomText';
import { getAppStyles, getShadows, icons } from '../utilities';
import { heightPixel, widthPixel } from '../utilities/helpers';
import moment from 'moment';
import { useTheme } from '../hooks';

interface DatePickerProps {
  label?: string;
  value: string;
  onDateChange: (date: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
  rightIcon?: any;
  containerStyle?: any;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onDateChange,
  mode = 'date',
  placeholder = 'Select date',
  rightIcon,
  containerStyle,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDisplayValue = () => {
    if (!value) return placeholder;

    if (mode === 'time') {
      return moment(value, 'HH:mm').format('hh:mm A');
    }

    if (value === 'Present' || value === 'present') {
      return value;
    }

    return value;
  };

  const handleConfirm = (date: Date) => {
    setShowPicker(false);
    const formattedDate =
      mode === 'time'
        ? moment(date).format('HH:mm')
        : moment(date).format('MMMM DD');

    onDateChange(formattedDate);
  };

  const getDateValue = () => {
    if (!value || value === 'Present' || value === 'present') {
      return new Date();
    }

    try {
      let momentDate = moment(value, 'MMMM DD');
      if (!momentDate.isValid()) {
        momentDate = moment(value, 'MMM DD');
      }
      if (!momentDate.isValid()) {
        momentDate = moment(value);
      }

      return momentDate.isValid() ? momentDate.toDate() : new Date();
    } catch (error) {
      console.log('Date parsing error:', error);
      return new Date();
    }
  };

  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <View>
      {label && (
        <CustomText
          fontSize={12}
          weight="bold"
          color={colors.black}
          style={{ marginTop: 10, marginBottom: 10, marginLeft: 10 }}
        >
          {label}
        </CustomText>
      )}

      <TouchableOpacity
        style={[
          dynamicStyles(colors).container,
          containerStyle,
          (value === 'Present' || value === 'present') &&
            dynamicStyles(colors).disabledContainer,
        ]}
        onPress={() => {
          if (value !== 'Present' && value !== 'present') {
            setShowPicker(true);
          }
        }}
        activeOpacity={value === 'Present' || value === 'present' ? 1 : 0.8}
      >
        <TouchableOpacity style={dynamicStyles(colors).iconView}>
          <Image
            source={icons.calendar}
            style={dynamicStyles(colors).calendar}
          />
        </TouchableOpacity>
        <CustomText
          style={[
            dynamicStyles(colors).textInputStyle,
            !value && { color: colors.gray + '99' },
          ]}
        >
          {formatDisplayValue()}
        </CustomText>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPicker}
        mode={mode}
        date={getDateValue()}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        display="default"
        maximumDate={mode === 'date' ? new Date() : undefined}
      />
    </View>
  );
};

const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    calendar: {
      height: heightPixel(15),
      width: widthPixel(15),
      resizeMode: 'cover',
      tintColor: colors.black,
    },
    container: {
      height: 60,
      ...getShadows(false).shadow3,
      borderRadius: 30,
      gap: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    textInputStyle: {
      flex: 1,
      padding: 0,
      // marginHorizontal: 8,
      color: colors.black,
      textAlignVertical: 'center',
    },
    iconView: {
      // flex: 0.1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledContainer: {
      backgroundColor: colors.lightGray,
      opacity: 0.7,
    },
  });

export default DatePicker;
