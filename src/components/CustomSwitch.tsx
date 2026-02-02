import React, {FC, useState} from 'react';
import {Switch} from 'react-native-switch';
import {CustomSwitchI} from '../interface';
import { useTheme } from '../hooks';

const CustomSwitch: FC<CustomSwitchI> = ({switchVal, setSwitchVal}) => {
  const [isSwitch, setIsSwitch] = useState(false);
  const { colors, isDarkMode, toggleTheme } = useTheme();


  return (
    <Switch
      barHeight={20}
      circleSize={16}
      disabled={false}
      activeText={''}
      inActiveText={''}
      switchLeftPx={4}
      switchRightPx={4}
      circleBorderWidth={0}
      switchWidthMultiplier={2.3}
      backgroundActive={colors.black}
      backgroundInactive={colors.whitish}
      circleActiveColor={colors.purple1}
      circleInActiveColor={colors.purple2}
      value={switchVal || isSwitch}
      onValueChange={val =>
        setSwitchVal ? setSwitchVal(val) : setIsSwitch(val)
      }
    />
  );
};

export default CustomSwitch;
