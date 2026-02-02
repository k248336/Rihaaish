import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  getAppStyles,
  getColors,
  getShadows,
  icons,
  navigate,
  screens,
  utility,
} from '../utilities';
import { heightPixel, widthPixel } from '../utilities/helpers';
import { headerRightNotiIcon } from './NavigationOptions';
import useAppSelector from '../hooks/useAppSelector';
import { useTheme } from '../hooks';
import {
  Favourite,
  Home,
  Location,
  Profile,
  MapScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function BottomTabs() {
  const { userInfo } = useAppSelector(state => state.auth);
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  const screenOptions = {
    animation: 'slide_from_right',
    navigationBarHidden: true,
    statusBarStyle: isDarkMode ? 'light' : 'dark',
    statusBarTranslucent: false,
    statusBarBackgroundColor: colors.red,
    headerTitle: '',
    headerShadowVisible: true,
    headerStyle: {
      elevation: 0,
      backgroundColor: colors.primary,
      shadowColor: colors.transparent,
    },
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={screens.home}
          options={{
            headerShown: true,
          }}
          component={Home}
        />
      </Stack.Navigator>
    );
  };
  const FavouriteStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={screens.favourite}
          options={{
            headerShown: true,
          }}
          component={Favourite}
        />
      </Stack.Navigator>
    );
  };
  const LocationStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={screens.location}
          options={{
            headerShown: false,
            // headerShown: true,
          }}
          component={Location}
        />
      </Stack.Navigator>
    );
  };

  const ProfileStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={screens.profile}
          component={Profile}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    );
  };

  const BottomTabs = [
    {
      label: 'Home',
      name: 'HomeScreen',
      initialRoute: screens.home,
      component: HomeStack,
      focusedicon: icons.home,
      unfocusedicon: icons.unfilledhome,
      headerTitle: 'Home',
    },
    {
      label: 'Favorite',
      name: 'FavouriteScreen',
      initialRoute: screens.favourite,
      component: FavouriteStack,
      focusedicon: icons.filledfavourite,
      unfocusedicon: icons.favourite,
      headerTitle: 'Favourite',
    },
    {
      label: 'Add',
      name: 'AddScreen',
      // initialRoute: screens.home, // Or a dedicated add screen
      component: HomeStack, // Placeholder component
      headerTitle: '',
    },

    {
      label: 'Map',
      name: 'MapScreenTab',
      initialRoute: screens.location,
      component: LocationStack,
      focusedicon: icons.filledlocation,
      unfocusedicon: icons.location,
      headerTitle: 'Map',
    },

    {
      label: 'Profile',
      name: 'ProfileScreen',
      initialRoute: screens.profile,
      component: ProfileStack,
      focusedicon: icons.filleduser,
      unfocusedicon: icons.user,
      headerTitle: '',
    },
  ];

  return (
    <View style={{flex:1,backgroundColor:colors.primary}}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          lazy: false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarItemStyle: dynamicStyles(colors).tabBarItemStyle,
          tabBarStyle: dynamicStyles(colors).tabBarStyle,
        })}
        initialRouteName={'HomeScreen'}
      >
        {BottomTabs.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarIcon: ({ focused }) => {
                return (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    {focused && item.name == 'AddScreen' ? (
                      ''
                    ) : focused ? (
                      <LinearGradient
                        colors={['#776CF8', '#3F12A5']}
                        style={dynamicStyles(colors).tabBarIconView}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Image
                          resizeMode="contain"
                          source={item.focusedicon}
                          style={[
                            dynamicStyles(colors).tabIconStyle01,
                            // { tintColor: colors.white }, // ⭐ Active icon color
                          ]}
                        />
                      </LinearGradient>
                    ) : (
                      <View
                        style={[
                          dynamicStyles(colors).tabBarIconView,
                          {
                            // backgroundColor: colors.inactivetab,
                          },
                        ]}
                      >
                        <Image
                          resizeMode="contain"
                          tintColor={colors.primary}
                          source={item.unfocusedicon}
                          style={[dynamicStyles(colors).tabIconStyle01]}
                        />
                      </View>
                    )}
                  </View>
                );
              },
            }}
          />
        ))}
      </Tab.Navigator>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigate(screens.AddProperty)}
        style={dynamicStyles(colors).plusButton}
      >
        <Image source={icons.plus} style={dynamicStyles(colors).plusIcon} />
      </TouchableOpacity>
    </View>
  );
}

const dynamicStyles = (colors: any) => StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0.02,
    paddingTop: heightPixel(7),
    paddingHorizontal: widthPixel(6),
    marginHorizontal: widthPixel(20),
    borderRadius: heightPixel(100),
    position: 'absolute',
    marginBottom: 10,
    backgroundColor: colors.background,
    ...getShadows(false).shadow3,

    height: utility.isPlatformIOS ? heightPixel(75) : heightPixel(75),
  },
  tabBarItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPixel(60),
    height: heightPixel(60),
  },
  tabBarIconView: {
    alignItems: 'center',
    
    justifyContent: 'center',
    width: widthPixel(50),
    height: heightPixel(50),
    borderRadius: heightPixel(60),
  },
  tabIconStyle01: {
    width: widthPixel(25),
    height: heightPixel(25),
  },
  plusButton: {
    position: 'absolute',
    bottom: heightPixel(50),
    alignSelf: 'center',
    backgroundColor: colors.purple1,
    borderRadius: widthPixel(30),
    width: widthPixel(60),
    height: widthPixel(60),
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  plusIcon: {
    width: widthPixel(20),
    height: heightPixel(20),
    tintColor: 'white',

    // tintColor: colors.primary,
    resizeMode: 'contain',
  },
});
