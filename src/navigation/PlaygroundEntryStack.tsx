import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SharedBoundsList from "./screens/playground-entry-stack/SharedBoundsList";
import SharedBoundsDetail from "./screens/playground-entry-stack/SharedBoundsDetail";
import ImageControlActions from "./screens/playground-entry-stack/ImageControlActions";
import { TouchableOpacity } from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';
import { View } from "react-native";

export type PlaygroundEntryStackParamList = {
    // ManualGestures: undefined;
    // DraggableSortingGrid: undefined;
    SharedBoundsList: undefined;
    SharedBoundsDetail: { id: string };
    ImageControlActions: undefined;
};

const Stack = createNativeStackNavigator<PlaygroundEntryStackParamList>();

function BackButton({ navigation }: { navigation: any }) {
    return (
        <TouchableOpacity
            testID='back-button'
            onPress={() => navigation.goBack()}
        >
            <View
                className='w-12 h-12 rounded-full bg-white/90 items-center justify-center'
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                }}
            >
                <FontAwesome6 name='arrow-left' size={20} color='#374151' iconStyle='solid' />
            </View>
        </TouchableOpacity>
    );
}

export default function PlaygroundEntryStack() {
    return (
        <Stack.Navigator initialRouteName="SharedBoundsList">
            <Stack.Screen
                name="SharedBoundsList"
                component={SharedBoundsList}
                options={({ navigation }) => ({
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <BackButton navigation={navigation} />
                    ),
                })}
            />
            <Stack.Screen
                name="SharedBoundsDetail"
                component={SharedBoundsDetail}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ImageControlActions"
                component={ImageControlActions}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}
