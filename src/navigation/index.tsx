import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './screens/get-started/Onboarding';
import { StatusBar } from 'expo-status-bar';

type RootStackParamList = {
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export const Navigation = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootStack />
    </NavigationContainer>
  )
}
