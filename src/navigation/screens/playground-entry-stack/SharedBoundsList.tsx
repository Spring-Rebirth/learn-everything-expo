import { View, Text, Image, Pressable } from "react-native";
import { imageAssets } from "../../../constant/imageAssets";
import Animated from "react-native-reanimated";

const items = [
    { id: 'a', title: 'Green Lake', image: imageAssets.nature1 },
    { id: 'b', title: 'Blue Sky', image: imageAssets.nature2 },
    { id: 'c', title: 'Flame Mountain', image: imageAssets.nature3 },
    { id: 'd', title: 'Green Lake', image: imageAssets.nature1 },
    { id: 'e', title: 'Blue Sky', image: imageAssets.nature2 },
    { id: 'f', title: 'Flame Mountain', image: imageAssets.nature3 },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SharedBoundsList({ navigation }: any) {

    return (
        <View className="bg-slate-50 flex-1 px-4">
            <Animated.ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, marginTop: 10 }}
            >
                {items.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => navigation.navigate(
                            'SharedBoundsDetail',
                            { id: item.id },
                        )}
                        style={({ pressed }) => ({
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            overflow: 'hidden',
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                        })}
                    >
                        <AnimatedImage
                            sharedTransitionTag={`image-${item.id}`}
                            source={item.image}
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                        <Animated.View
                            sharedTransitionTag={`title-${item.id}`}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                backgroundColor: 'white',
                            }}
                        >
                            <Text className="text-lg font-bold text-gray-900">
                                {item.title}
                            </Text>
                        </Animated.View>
                        <Text className="text-sm text-gray-600 px-4 pb-4">
                            Tap to view details
                        </Text>
                    </Pressable>
                ))}
            </Animated.ScrollView>
        </View>
    );
}
