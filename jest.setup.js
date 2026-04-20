jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Swipeable: View,
    DrawerLayout: View,
    TouchableOpacity: View,
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    ScrollView: View,
    FlatList: View,
    gestureHandlerRootHOC: C => C,
    Directions: {},
    State: {},
  };
});

require('@testing-library/react-native/matchers');

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

/**
 * The official `react-native-reanimated/mock` requires the real native Worklets
 * runtime (Reanimated 4). Use a lightweight stub so Jest never loads native code.
 */
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const { View } = RN;
  const ID = t => t;
  const NOOP = () => {};
  return {
    __esModule: true,
    default: {
      View,
      Image: RN.Image,
      Text: RN.Text,
      ScrollView: RN.ScrollView,
      FlatList: RN.FlatList,
      ImageBackground: RN.ImageBackground,
      createAnimatedComponent: c => c,
      call: NOOP,
    },
    useSharedValue: v => ({ value: v }),
    useAnimatedStyle: fn => {
      try {
        return typeof fn === 'function' ? fn() : {};
      } catch {
        return {};
      }
    },
    useAnimatedProps: fn => (typeof fn === 'function' ? fn() : {}),
    withTiming: ID,
    withSpring: ID,
    withDecay: ID,
    withDelay: (_d, v) => v,
    withSequence: (...a) => a[a.length - 1],
    withRepeat: v => v,
    cancelAnimation: NOOP,
    runOnJS: fn => fn,
    runOnUI: fn => fn,
    FadeIn: {},
    FadeOut: {},
    FadeInDown: {},
    FadeInUp: {},
    SlideInRight: {},
    Layout: {},
    Extrapolation: { EXTEND: 'extend', CLAMP: 'clamp', IDENTITY: 'identity' },
    interpolate: ID,
    Easing: {
      linear: ID,
      ease: ID,
      quad: ID,
      cubic: ID,
    },
    Keyframe: class {},
    useReducedMotion: () => false,
    createAnimatedPropAdapter: () => {},
    useAnimatedScrollHandler: () => ({}),
    useAnimatedReaction: NOOP,
    useAnimatedRef: () => ({ current: null }),
    useScrollViewOffset: () => ({ value: 0 }),
    measure: () => ({ x: 0, y: 0, width: 0, height: 0 }),
    scrollTo: NOOP,
    advanceAnimationByFrame: NOOP,
    advanceAnimationByTime: NOOP,
    setUpTests: NOOP,
    withReanimatedTimer: cb => cb(),
    getAnimatedStyle: () => ({}),
    reanimatedVersion: '0.0.0-mock',
    ColorSpace: {},
    InterfaceOrientation: {},
    IOSReferenceFrame: {},
    KeyboardState: {},
    ReduceMotion: {},
    SensorType: {},
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }) =>
    React.createElement(View, props, children);
});

jest.mock('react-native-flash-message', () => {
  const React = require('react');
  function FlashMessage() {
    return null;
  }
  return { __esModule: true, default: FlashMessage };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    SafeAreaProvider: View,
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '0.0.1'),
  getBuildNumber: jest.fn(() => '1'),
}));

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistStore: () => ({
      flush: () => Promise.resolve(),
      purge: () => Promise.resolve(),
      pause: () => {},
      persist: () => {},
      getState: () => ({ bootstrapped: true, registry: [] }),
      dispatch: () => {},
      subscribe: (cb) => {
        cb();
        return () => {};
      },
    }),
  };
});

jest.mock('redux-persist/integration/react', () => {
  const React = require('react');
  return {
    PersistGate: ({ children }) =>
      React.createElement(React.Fragment, null, children),
  };
});
