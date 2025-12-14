import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/root-tabs/Home';
import PlaygroundScreen from '../screens/root-tabs/Playground';
import LabsScreen from '../screens/root-tabs/Labs';
import { Image, Platform } from 'react-native';

export type RootBottomTabsParamList = {
  Home: undefined;
  Playground: undefined;
  Labs: undefined;
};

const BottomTab = createBottomTabNavigator<RootBottomTabsParamList>();

export default function RootBottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fb7185',
        tabBarInactiveTintColor: '#8E8E93',
        freezeOnBlur: true,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: 'Home',
        }}
      />
      <BottomTab.Screen
        name="Playground"
        component={PlaygroundScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/play.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: 'Playground',
        }}
      />
      <BottomTab.Screen
        name="Labs"
        component={LabsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/labs.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: 'Labs',
        }}
      />
    </BottomTab.Navigator>
  );
}
