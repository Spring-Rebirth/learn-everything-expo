import { View, Text, Image, Pressable, Dimensions } from "react-native";
import Transition from "react-native-screen-transitions";
import { imageAssets } from "../../../constant/imageAssets";

const imagesMap: Record<string, any> = {
    a: imageAssets.nature1,
    b: imageAssets.nature2,
    c: imageAssets.nature3,
    d: imageAssets.nature1,
    e: imageAssets.nature2,
    f: imageAssets.nature3,
};

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
        <Transition.MaskedView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="relative">
                <Transition.View sharedBoundTag={`image-${id}`}>
                    <Image
                        source={image}
                        style={{ width, height: width * 0.66 }}
                        resizeMode="cover"
                    />
                </Transition.View>
                <Pressable
                    className="absolute top-14 left-4 bg-black/40 px-3 py-2 rounded-full"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white">Back</Text>
                </Pressable>
            </View>

            <View className="p-4">
                <Transition.View sharedBoundTag={`title-${id}`}>
                    <Text className="text-2xl font-bold text-gray-900">
                        {title}
                    </Text>
                </Transition.View>
                <Text className="text-gray-600 mt-3 leading-6">
                    This is a demo detail screen that uses measure-driven bounds transitions.
                    The image and title are measured on the list screen and then animated to
                    their new positions here.
                </Text>
            </View>
        </Transition.MaskedView>
    );
}


