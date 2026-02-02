import React, {useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

interface ZoomableImageProps {
  source: string;
}

export default function ZoomableImage(props: ZoomableImageProps) {
  const {source} = props;
  const scaleValue = useRef(1);

  return (
    <ImageZoom
      maxScale={2.5}
      useNativeDriver
      imageWidth={deviceWidth}
      imageHeight={deviceHeight}
      cropWidth={deviceWidth}
      cropHeight={deviceHeight}
      onMove={({scale}) => (scaleValue.current = scale)}
      onStartShouldSetPanResponder={e => {
        return e.nativeEvent.touches.length === 2 || scaleValue.current > 1;
      }}>
      <View
        style={styles.imgView}
        onStartShouldSetResponder={e => {
          return e.nativeEvent.touches.length < 2 && scaleValue.current <= 1;
        }}>
        <FastImage
          style={styles.imgStyle}
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: source,
            priority: FastImage.priority.high,
            headers: {Authorization: 'someAuthToken'},
          }}
        />
      </View>
    </ImageZoom>
  );
}

const styles = StyleSheet.create({
  imgView: {
    width: '100%',
    height: '100%',
  },
  imgStyle: {
    width: deviceWidth,
    height: deviceHeight,
  },
});
