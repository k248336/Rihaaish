import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import { useTheme } from '../hooks';
import { getAppStyles } from '../utilities';

export default function FastImageComp({
  source,
  style,
  resizeMode,
}: {
  source: string;
  style?: any;
  resizeMode?: ResizeMode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <View style={[dynamicStyles(colors).container, style]}>
      <FastImage
        source={{
          uri: source,
          priority: FastImage.priority.high,
          headers: { Authorization: 'someAuthToken' },
        }}
        resizeMode={resizeMode || FastImage.resizeMode.cover}
        style={{ height: style.height, width: style.width }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />

      {isLoading && (
        <View
          style={[
            dynamicStyles(colors).loaderView,
            { borderRadius: style?.borderRadius },
          ]}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}
const dynamicStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      // overflow: 'hidden',
      // backgroundColor: colors.red,
    },
    loaderView: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.greishBg,
    },
  });
