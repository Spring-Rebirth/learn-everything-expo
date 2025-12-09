import { useState } from 'react';
import { Dimensions, Text, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets'
import { CARDS } from '../../constant/mockCards';
import Card from '../../components/playground/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function TinderSwipe() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const activeCard = CARDS[currentIndex];
    const nextCard = CARDS[currentIndex + 1];

    // 1. 定义共享值
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // 2. 手势逻辑
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? 'right' : 'left';
                const destX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
                const destY = (event.translationY / event.translationX) * destX;

                const callback = direction === 'left' ? onSwipeRight : onSwipeLeft;

                // --- 修复重点：调整 Spring 配置 ---
                const springConfig = {
                    velocity: event.velocityX,
                    stiffness: 80,
                    damping: 20,
                    // 👇 新增：防止来回震荡，让动画结束得更干脆
                    overshootClamping: true,
                    // 👇 新增：只要距离终点 10px 以内就算结束 (默认是很小的 0.001)
                    restDisplacementThreshold: 0.1,
                    // 👇 新增：只要速度小于 10 就算结束 (默认是 0.001)
                    restSpeedThreshold: 0.1,
                };

                translateX.value = withSpring(destX, springConfig, (finished) => {
                    if (finished && callback) {
                        scheduleOnRN(callback);
                    }
                });

                translateY.value = withSpring(destY, springConfig);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const rotate = useDerivedValue(() => {
        return interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10],
            Extrapolation.CLAMP
        );
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    // --- 状态更新函数 ---
    function onSwipeLeft() {
        setCurrentIndex((prev) => prev + 1);
        translateX.value = 0;
        translateY.value = 0;
    }

    function onSwipeRight() {
        setCurrentIndex((prev) => prev + 1);
        translateX.value = 0;
        translateY.value = 0;
    }

    function pressedReset() {
        // 先归位动画值，再重置 Index，避免闪烁
        translateX.value = 0;
        translateY.value = 0;
        setCurrentIndex(0);
    }

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 justify-center items-center bg-neutral-100 relative">

                {/* --- A. 底层卡片 (Next Card) --- */}
                {nextCard && (
                    <View
                        className="absolute w-[90%] h-[60%] shadow-xl"
                        style={{ zIndex: 0 }}
                    >
                        <Card card={nextCard} />
                    </View>
                )}

                {/* --- B. 顶层卡片 (Active Card) --- */}
                {activeCard ? (
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            className="absolute w-[90%] h-[60%] shadow-xl"
                            style={[
                                animatedStyle,
                                { zIndex: 10 }
                            ]}
                        >
                            <Card card={activeCard} />
                        </Animated.View>
                    </GestureDetector>
                ) : (
                    /* --- C. 重置区域 --- */
                    <View className="items-center justify-center gap-5">
                        <Text className="text-lg font-bold text-neutral-500">
                            No more cards!
                        </Text>
                        <Text
                            onPress={pressedReset}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold overflow-hidden shadow-lg"
                        >
                            Reload Cards ↻
                        </Text>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    );
}
