import { DarkTheme, DefaultTheme, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/get-started/Onboarding';
import { StatusBar } from 'expo-status-bar';
import RootBottomTabs, { type RootBottomTabsParamList } from './RootBottomTabs';
import PlaygroundEntryStack, { type PlaygroundEntryStackParamList } from './PlaygroundEntryStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { useThemeContext } from '../providers/ThemeProvider';

export type RootStackParamList = {
  Onboarding: undefined;
  RootBottomTabs: {
    screen: keyof RootBottomTabsParamList;
  };
  PlaygroundEntryStack: {
    screen: keyof PlaygroundEntryStackParamList;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Onboarding: 'onboarding',
      RootBottomTabs: {
        path: 'tabs',
        screens: {
          Home: 'home',
          Playground: 'playground',
          Labs: 'labs',
        },
      },
      PlaygroundEntryStack: {
        path: 'lab',
        screens: {
          ManualGestures: 'manual-gestures',
          DraggableSortingGrid: 'draggable-grid',
          SharedBoundsList: 'shared-bounds',
          SharedBoundsDetail: 'shared-bounds/:id',
          TinderSwipe: 'tinder-swipe',
          ParallaxProfile: 'parallax-profile',
          NotificationsLab: 'notifications',
          CameraLab: 'camera',
          BottomSheetLab: 'bottom-sheet',
        },
      },
    },
  },
};

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
      <Stack.Screen name="RootBottomTabs" component={RootBottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PlaygroundEntryStack" component={PlaygroundEntryStack} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export const Navigation = () => {
  const { resolvedTheme } = useThemeContext();
  const navigationTheme = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking} theme={navigationTheme}>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
