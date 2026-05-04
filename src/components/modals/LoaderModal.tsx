import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { utility, deviceHeight } from '../../utilities';
import { useAppSelector } from '../../hooks';

const loaderSource = require('../../assets/lottie/loading-sand-clock.json');

interface LoaderModalProps {
  visible?: boolean;
}

export default function LoaderModal(props: LoaderModalProps) {
  const { visible } = props;
  const { isVisible } = useAppSelector(state => state?.loader);

  return (
    <Modal
      useNativeDriver
      statusBarTranslucent
      isVisible={visible || isVisible}
      backdropOpacity={0.8}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modalStyle}
      onBackdropPress={() => {}}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      deviceHeight={deviceHeight + deviceHeight}
    >
      <View style={styles.lottieContainer}>
        <LottieView
          source={loaderSource}
          autoPlay
          loop
          resizeMode="contain"
          style={styles.lottie}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    paddingBottom: utility.isPlatformIOS ? 85 : 65,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 140,
    height: 140,
  },
});
