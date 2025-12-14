import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import HomeScreen from '../screens/root-tabs/Home';
import PlaygroundScreen from '../screens/root-tabs/Playground';
import NoticeScreen from '../screens/root-tabs/Notice';
import { Platform } from 'react-native';

export type RootBottomTabsParamList = {
  Home: undefined;
  Playground: undefined;
  Notice: undefined;
};

const BottomTab = createNativeBottomTabNavigator<RootBottomTabsParamList>();

export default function RootBottomTabs() {
  return (
    <BottomTab.Navigator
      tabBarActiveTintColor="#fb7185"
      tabBarInactiveTintColor="#8E8E93"
      screenOptions={{
        freezeOnBlur: true,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => Platform.select({
            ios: { sfSymbol: focused ? 'house.fill' : 'house' },
            android: require('../assets/icons/home.png'),
            default: require('../assets/icons/home.png'),
          }),
          title: 'Home',
        }}
      />
      <BottomTab.Screen
        name="Playground"
        component={PlaygroundScreen}
        options={{
          tabBarIcon: ({ focused }) => Platform.select({
            ios: { sfSymbol: focused ? 'play.fill' : 'play' },
            android: require('../assets/icons/play.png'),
            default: require('../assets/icons/play.png'),
          }),
          title: 'Playground',
        }}
      />
      <BottomTab.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          tabBarIcon: ({ focused }) => Platform.select({
            ios: { sfSymbol: focused ? 'bell.fill' : 'bell' },
            android: require('../assets/icons/bell.png'),
            default: require('../assets/icons/bell.png'),
          }),
          title: 'Notice',
        }}
      />
    </BottomTab.Navigator>
  );
}
