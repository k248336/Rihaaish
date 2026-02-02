import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { utility, deviceHeight } from '../../utilities';
import { useAppSelector } from '../../hooks';

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
      <ActivityIndicator size="large" color={'red'} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    paddingBottom: utility.isPlatformIOS ? 85 : 65,
  },
});
