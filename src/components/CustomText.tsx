import React, { FC, useState } from 'react';
import {
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontFamily } from '../utilities';
import { font, heightPixel, widthPixel } from '../utilities/helpers';
import { useTheme } from '../hooks';

interface CustomTextProps extends TextProps {
  fontSize?: number;
  color?: string;
  flex?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  underline?: boolean;
  onPress?: () => void;
  textAlignCenter?: boolean;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  fontfamily?: 'Gilroy';
  showMoreLimit?: number;
}

const CustomText: FC<CustomTextProps> = ({
  fontSize = 14,
  flex,
  style,
  center,
  onPress,
  children,
  underline,
  numberOfLines,
  textAlignCenter,
  weight = 'regular',
  color = 'black',
  fontfamily = 'Gilroy',
  showMoreLimit,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const { colors, isDarkMode } = useTheme();

  if (!children) return null;

  const toggleExpanded = () => setExpanded(!expanded);

  const text = Array.isArray(children)
    ? children.join('')
    : typeof children === 'string'
    ? children
    : children?.toString() || '';

  const shouldShowReadMore = showMoreLimit && text.length > showMoreLimit;

  const displayedText =
    shouldShowReadMore && !expanded
      ? text.slice(0, showMoreLimit) + '...'
      : text;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Text
        {...props}
        onPress={onPress}
        allowFontScaling={false}
        style={[
          { fontFamily: fontFamily[fontfamily][weight] },
          center && { alignSelf: 'center' },
          textAlignCenter && { textAlign: 'center' },
          underline && { textDecorationLine: 'underline' },
          { fontSize: font(fontSize) },
          { color },
          style,
        ]}
      >
        {displayedText}
      </Text>

      {shouldShowReadMore && (
        <TouchableOpacity onPress={toggleExpanded}>
          <Text
            style={{
              color: colors.primary || 'blue',
              fontSize: font(fontSize - 1),
              fontFamily: fontFamily[fontfamily].bold,
              marginLeft: widthPixel(5),
              marginTop: heightPixel(1),
            }}
          >
            {expanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CustomText);
