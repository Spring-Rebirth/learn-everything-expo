import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/root-tabs/Home';
import PlaygroundScreen from '../screens/root-tabs/Playground';
import NoticeScreen from '../screens/root-tabs/Notice';
import { Image, Platform } from 'react-native';

export type RootBottomTabsParamList = {
  Home: undefined;
  Playground: undefined;
  Notice: undefined;
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
        name="Notice"
        component={NoticeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/bell.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: 'Notice',
        }}
      />
    </BottomTab.Navigator>
  );
}
