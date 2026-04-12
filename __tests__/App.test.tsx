/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../src/navigation', () => {
  const React = require('react');
  const { View } = require('react-native');
  function MockRootNavigation() {
    return React.createElement(View, { testID: 'root-navigation' });
  }
  return { __esModule: true, default: MockRootNavigation };
});

import App from '../App';

describe('App', () => {
  it('renders the app shell with providers', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('root-navigation')).toBeOnTheScreen();
  });
});
