import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SharedTransitionList from "../screens/playground-entry-stack/SharedTransitionList";
import SharedTransitionDetail from "../screens/playground-entry-stack/SharedTransitionDetail";
import { BackButton } from "../components/playground/BackButton";

export type SharedTransitionStackParamList = {
    SharedTransitionList: undefined;
    SharedTransitionDetail: { id: string };
};

const Stack = createNativeStackNavigator<SharedTransitionStackParamList>();

export default function SharedTransitionStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SharedTransitionList"
                component={SharedTransitionList}
                options={({ navigation }) => ({
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <BackButton navigation={navigation} />
                    ),
                })}
            />
            <Stack.Screen
                name="SharedTransitionDetail"
                component={SharedTransitionDetail}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    animation: 'fade',
                    animationDuration: 10,
                }}
            />
        </Stack.Navigator>
    );
}
