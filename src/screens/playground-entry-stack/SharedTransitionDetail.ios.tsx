import { View, Text, Image, Pressable, Dimensions, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { imageAssets } from "../../constant/imageAssets";
import { FontAwesome6 } from "@expo/vector-icons";

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

export default function SharedTransitionDetail({ route, navigation }: any) {
    const { id } = route.params;
    const image = imagesMap[id] ?? imageAssets.nature1;
    const detailImageHeight = SCREEN_WIDTH * 0.66;

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{ position: 'relative' }}>
                    <AnimatedImage
                        sharedTransitionTag={`image-${id}`}
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
                            top: 40,
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
                            onPress={goBack}
                        >
                            <FontAwesome6 name="arrow-left" size={20} color="white" />
                        </Pressable>
                    </Animated.View>
                </View>

                {/* 这里可以添加更多详情内容 */}
                <View style={styles.detailContent}>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    detailContent: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        paddingTop: 32,
    },
});
