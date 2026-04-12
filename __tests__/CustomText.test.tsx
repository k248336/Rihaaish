import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CustomText from '../src/components/CustomText';
import themeReducer from '../src/redux/slices/theme';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { theme: themeReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('CustomText', () => {
  it('renders children', () => {
    renderWithStore(<CustomText>Hello Rihaaish</CustomText>);
    expect(screen.getByText('Hello Rihaaish')).toBeOnTheScreen();
  });
});
