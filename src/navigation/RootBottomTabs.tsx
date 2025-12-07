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

const icons = {
  home: require('../assets/icons/home.png'),
  play: require('../assets/icons/play.png'),
  notice: require('../assets/icons/bell.png'),
};

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
            android: icons.home,
            default: icons.home,
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
            android: icons.play,
            default: icons.play,
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
            android: icons.notice,
            default: icons.notice,
          }),
          title: 'Notice',
        }}
      />
    </BottomTab.Navigator>
  );
}
