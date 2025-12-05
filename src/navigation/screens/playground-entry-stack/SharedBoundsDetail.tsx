import { View, Text, Image, Pressable, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { imageAssets } from "../../../constant/imageAssets";

const imagesMap: Record<string, any> = {
    a: imageAssets.nature1,
    b: imageAssets.nature2,
    c: imageAssets.nature3,
    d: imageAssets.nature1,
    e: imageAssets.nature2,
    f: imageAssets.nature3,
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SharedBoundsDetail({ route, navigation }: any) {
    const { id } = route.params;
    const image = imagesMap[id] ?? imageAssets.nature1;
    let title;

    switch (id) {
        case 'a':
            title = 'Green Lake';
            break;
        case 'b':
            title = 'Blue Sky';
            break;
        case 'c':
            title = 'Flame Mountain';
            break;
        case 'd':
            title = 'Green Lake';
            break;
        case 'e':
            title = 'Blue Sky';
            break;
        default:
            title = 'Flame Mountain';
    }

    const { width } = Dimensions.get('window');

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="relative">
                <AnimatedImage
                    sharedTransitionTag={`image-${id}`}
                    source={image}
                    style={{ width, height: width * 0.66 }}
                    resizeMode="cover"
                />
                <Pressable
                    className="absolute top-14 left-4 bg-black/40 px-3 py-2 rounded-full z-10"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-medium">Back</Text>
                </Pressable>
            </View>

            <View className="p-4">
                <Animated.View
                    sharedTransitionTag={`title-${id}`}
                    style={{
                        alignSelf: 'flex-start', // 防止宽度自动撑满，影响过渡定位
                        backgroundColor: 'white',
                        marginBottom: 12
                    }}
                >
                    <Text className="text-2xl font-bold text-gray-900">
                        {title}
                    </Text>
                </Animated.View>

                <Animated.Text
                    entering={FadeIn.delay(200).duration(500)}
                    className="text-gray-600 leading-6"
                >
                    This is a demo detail screen that uses measure-driven bounds transitions.
                    The image and title are measured on the list screen and then animated to
                    their new positions here.
                </Animated.Text>
            </View>
        </View>
    );
}
