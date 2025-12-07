import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import HomeScreen from '../screens/root-tabs/Home';
import PlaygroundScreen from '../screens/root-tabs/Playground';
import NoticeScreen from '../screens/root-tabs/Notice';
import { FontAwesome6 } from '@expo/vector-icons';
import { Platform } from 'react-native';

export type RootBottomTabsParamList = {
  Home: undefined;
  Playground: undefined;
  Notice: undefined;
};

const BottomTab = createNativeBottomTabNavigator<RootBottomTabsParamList>();

// 暂时使用 require 占位，实际项目中应替换为真实图片资源
// 建议在 assets/icons/ 下添加 home.png, play.png, bell.png
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
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => Platform.select({
            ios: { sfSymbol: focused ? 'house.fill' : 'house' },
            android: icons.home, // Android 需要 PNG 资源
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
