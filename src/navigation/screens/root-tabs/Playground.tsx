import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation";
import { PlaygroundEntryStackParamList } from "../../PlaygroundEntryStack";

type PageItem = {
    id: string;
    name: string;
    destination: keyof PlaygroundEntryStackParamList;
};

export default function Playground() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const pageList: PageItem[] = [
        // {
        //     id: '0',
        //     name: '手动手势',
        //     destination: 'ManualGestures'
        // },
        // {
        //     id: '1',
        //     name: '网格拖拽排序',
        //     destination: 'DraggableSortingGrid'
        // },
        {
            id: '2',
            name: 'Shared Bounds 过渡示例',
            destination: 'SharedBoundsList'
        },
    ];

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4">
                {pageList.map((page) => (
                    <Pressable
                        key={page.id}
                        onPress={() => navigation.navigate('PlaygroundEntryStack', {
                            screen: page.destination
                        })}
                        className="bg-blue-500 rounded-lg p-4 m-2 shadow-md items-center mb-4"
                    >
                        <Text className="text-white font-bold text-lg">{page.name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}