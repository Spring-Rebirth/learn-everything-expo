import { View, Image, Pressable, Dimensions } from "react-native";
import { imageAssets } from "../../constant/imageAssets";
import Animated, { SharedTransition } from "react-native-reanimated";

const items = [
    { id: 'a', image: imageAssets.nature1 },
    { id: 'b', image: imageAssets.nature2 },
    { id: 'c', image: imageAssets.nature3 },
    { id: 'd', image: imageAssets.nature1 },
    { id: 'e', image: imageAssets.nature2 },
    { id: 'f', image: imageAssets.nature3 },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 图片使用弹性过渡动画
const imageTransition = SharedTransition
    .springify()
    .damping(18)
    .stiffness(120)
    .mass(0.8);

export default function SharedBoundsList({ navigation }: any) {
    const listImageWidth = SCREEN_WIDTH - 32; // px-4 = 16px * 2
    const listImageHeight = 192; // h-48 = 192px

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
                            sharedTransitionStyle={imageTransition}
                            source={item.image}
                            style={{
                                width: listImageWidth,
                                height: listImageHeight,
                                borderRadius: 16,
                            }}
                            resizeMode="cover"
                        />
                    </Pressable>
                ))}
            </Animated.ScrollView>
        </View>
    );
}
