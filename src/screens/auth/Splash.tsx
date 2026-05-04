import { ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import { images, replace, screens } from '../../utilities';
import { useAppSelector } from '../../hooks';

export default function Splash() {
  const { hasSeenOnboarding } = useAppSelector(state => state?.onboarding);
  const { accessToken } = useAppSelector(state => state?.auth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accessToken) {
        replace(screens.bottomTabs);
        return;
      }
      if (hasSeenOnboarding) {
        replace(screens.login);
      } else {
        replace(screens.onBoarding);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasSeenOnboarding, accessToken]);

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={images.splash}
    ></ImageBackground>
  );
}
