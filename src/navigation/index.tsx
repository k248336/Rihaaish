import React, { forwardRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';

const RootNavigation = forwardRef((props, ref: any) => {
  return (
    <NavigationContainer ref={ref}>
      <MainNavigation />
    </NavigationContainer>
  );
});

export default RootNavigation;
