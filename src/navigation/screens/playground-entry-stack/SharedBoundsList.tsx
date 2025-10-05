import { View, Text, Image } from "react-native";
import Transition from "react-native-screen-transitions";
import { imageAssets } from "../../../constant/imageAssets";

const items = [
    { id: 'a', title: 'Green Lake', image: imageAssets.nature1 },
    { id: 'b', title: 'Blue Sky', image: imageAssets.nature2 },
    { id: 'c', title: 'Flame Mountain', image: imageAssets.nature3 },
    { id: 'd', title: 'Green Lake', image: imageAssets.nature1 },
    { id: 'e', title: 'Blue Sky', image: imageAssets.nature2 },
    { id: 'f', title: 'Flame Mountain', image: imageAssets.nature3 },
];

const ScrollView = Transition.ScrollView;

export default function SharedBoundsList({ navigation }: any) {

    return (
        <View className="bg-slate-50 flex-1 px-4">
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, marginTop: 10 }}
            >
                {items.map((item) => (
                    <Transition.Pressable
                        key={item.id}
                        sharedBoundTag={`image-${item.id}`}
                        onPress={() => navigation.navigate(
                            'SharedBoundsDetail',
                            { id: item.id },
                        )}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            overflow: 'hidden',
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <Image
                            source={item.image}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <Transition.View
                            sharedBoundTag={`title-${item.id}`}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                backgroundColor: 'white',
                            }}
                        >
                            <Text className="text-lg font-bold text-gray-900">
                                {item.title}
                            </Text>
                        </Transition.View>
                        <Text className="text-sm text-gray-600 px-4 pb-4">
                            Tap to view details
                        </Text>
                    </Transition.Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
