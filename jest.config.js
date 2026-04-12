module.exports = {
  preset: 'react-native',
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/vendor/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-worklets|react-native-gesture-handler|react-native-drawer-layout|react-native-screens|react-native-safe-area-context|@react-navigation|react-redux|@reduxjs/toolkit|immer|reselect)/)',
  ],
};
