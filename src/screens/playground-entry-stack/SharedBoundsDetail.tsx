import { View, Text, Image, Pressable, Dimensions } from "react-native";
import Animated, { FadeIn, SharedTransition } from "react-native-reanimated";
import { imageAssets } from "../../constant/imageAssets";

const imagesMap: Record<string, any> = {
    a: imageAssets.nature1,
    b: imageAssets.nature2,
    c: imageAssets.nature3,
    d: imageAssets.nature1,
    e: imageAssets.nature2,
    f: imageAssets.nature3,
};

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 图片使用弹性过渡动画（与列表页保持一致）
const imageTransition = SharedTransition
    .springify()
    .damping(18)
    .stiffness(120)
    .mass(0.8);

export default function SharedBoundsDetail({ route, navigation }: any) {
    const { id } = route.params;
    const image = imagesMap[id] ?? imageAssets.nature1;
    const detailImageHeight = SCREEN_WIDTH * 0.66;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ position: 'relative' }}>
                <AnimatedImage
                    sharedTransitionTag={`image-${id}`}
                    sharedTransitionStyle={imageTransition}
                    source={image}
                    style={{
                        width: SCREEN_WIDTH,
                        height: detailImageHeight,
                    }}
                    resizeMode="cover"
                />
                <Animated.View
                    entering={FadeIn.delay(250).duration(300)}
                    style={{
                        position: 'absolute',
                        top: 56,
                        left: 16,
                        zIndex: 10,
                    }}
                >
                    <Pressable
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 9999,
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ color: 'white', fontWeight: '500' }}>Back</Text>
                    </Pressable>
                </Animated.View>
            </View>

        </View>
    );
}
