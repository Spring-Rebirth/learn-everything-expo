import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodosScreen from '../screens/root-tabs/Todos';
import HabitsScreen from '../screens/root-tabs/Habits';
import SettingsScreen from '../screens/root-tabs/Settings';
import { Image } from 'react-native';

export type RootBottomTabsParamList = {
  Todos: undefined;
  Habits: undefined;
  Settings: undefined;
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
        name="Todos"
        component={TodosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: '待办',
        }}
      />
      <BottomTab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/play.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: '习惯',
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/labs.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          title: '设置',
        }}
      />
    </BottomTab.Navigator>
  );
}

