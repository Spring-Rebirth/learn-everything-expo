import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/get-started/Onboarding';
import { StatusBar } from 'expo-status-bar';
import RootBottomTabs, { type RootBottomTabsParamList } from './RootBottomTabs';
import PlaygroundEntryStack, { type PlaygroundEntryStackParamList } from './PlaygroundEntryStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
