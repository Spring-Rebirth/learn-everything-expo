import { View, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    withTiming,
    withSpring,
    Easing
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function ImageControlActions() {
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 4;

    const clamp = (v: number, min: number, max: number) => {
        'worklet';
        return Math.max(min, Math.min(v, max));
    }

    // rawScale 跟随手势，scale 经过轻微缓动用于渲染，提升平滑度
    const rawScale = useSharedValue(1);
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    useDerivedValue(() => {
        const target = clamp(rawScale.value, MIN_SCALE, MAX_SCALE);
        scale.value = withTiming(target, {
            duration: 50,
            easing: Easing.out(Easing.quad)
        });
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const gesture = Gesture.Pinch()
        .onBegin(() => {
            savedScale.value = rawScale.value;
        })
        .onUpdate(e => {
            rawScale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            const next = clamp(rawScale.value, MIN_SCALE, MAX_SCALE);
            rawScale.value = withSpring(next, { damping: 20, stiffness: 200 });
            savedScale.value = next;
        })

    return (
        <View className="flex-1">
            <GestureDetector gesture={gesture}>
                <Animated.Image
                    source={require('../../assets/images/emma-swoboda.jpg')}
                    style={[styles.image, animatedStyle]}
                />
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 400,
        height: 860,
    }
})