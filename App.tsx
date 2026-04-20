import 'react-native-gesture-handler';
import './src/api/initMockApi';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './src/redux/store';
import RootNavigation from './src/navigation';
import { navigatorRef } from './src/utilities';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <RootNavigation ref={navigatorRef} />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>

      <FlashMessage position="top" floating={true} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

export default App;
