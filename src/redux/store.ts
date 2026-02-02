import { persistStore, persistReducer } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reset, screens, utility } from '../utilities';
import { setLanguage } from './slices/language';
import notificationReducer from './slices/notification';
import loaderReducer from './slices/loader';
import authReducer from './slices/auth';
import onboardingReducer from './slices/onboarding';
import themeReducer from './slices/theme';
import languageReducer from './slices/language';
import { RootState } from '../interface';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const appReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  notification: notificationReducer,
  onboarding: onboardingReducer,
  theme: themeReducer,
  language: languageReducer,
});

let hasSessionTimedOut = false;

const rootReducer = (state: RootState | undefined, action: any) => {
  // console.log('action: ', action);
  if (
    action.payload?.code === 401 &&
    action.payload?.message === 'Invalid authorization header' &&
    state?.auth?.accessToken
  ) {
    if (!hasSessionTimedOut) {
      hasSessionTimedOut = true;

      utility.showAlertMessage(
        'danger',
        'Your session has been expired. Please Login to continue.',
      );
      reset(screens.login);

      setTimeout(() => {
        hasSessionTimedOut = false;
      }, 2000);

      return appReducer(undefined, action);
    }
  } else if (
    action.type === 'auth/removeAccessToken' ||
    action.type === 'logout/fulfilled' ||
    action.type === 'deleteAccount/fulfilled'
  ) {
    const newState = appReducer(state, action);
    return {
      ...newState,
      language: { ...newState.language, currentLanguage: 'en' },
    };
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };
