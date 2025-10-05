import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/root-tabs/Home';
import PlaygroundScreen from './screens/root-tabs/Playground';
import NoticeScreen from './screens/root-tabs/Notice';
import { FontAwesome6 } from '@expo/vector-icons';

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
                headerShown: false,
                tabBarActiveTintColor: '#fb7185',
                tabBarInactiveTintColor: '#8E8E93',
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6 name="house" size={size} color={color} solid />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Playground"
                component={PlaygroundScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6 name="play" size={size} color={color} solid />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Notice"
                component={NoticeScreen}
                options={{
                    tabBarLabel: 'Notice',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6 name="bell" size={size} color={color} solid />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}