import { ImageBackground, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { images, navigate, replace, screens } from '../../utilities';
import { useAppSelector } from '../../hooks';

export default function Splash() {
  const { hasSeenOnboarding } = useAppSelector(state => state?.onboarding);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasSeenOnboarding) {
        replace(screens.login);
      } else {
        replace(screens.onBoarding);
      }

      replace('Login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={images.splash}
    ></ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
