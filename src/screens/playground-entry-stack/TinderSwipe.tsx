import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { CARDS } from '../../constant/mockCards';
import Card from '../../components/playground/Card';
import SwipeableCard from '../../components/playground/SwipeableCard';
import BackgroundCard from '../../components/playground/BackgroundCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_Z_INDEX = {
    BACKGROUND: 0,
    FOREGROUND: 10,
};

export default function TinderSwipe() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const activeCard = CARDS[currentIndex];
    const nextCard = CARDS[currentIndex + 1];

    const sharedTranslateX = useSharedValue(0);

    const nextCardStyle = useAnimatedStyle(() => {
        const translationX = Math.abs(sharedTranslateX.value);

        const scale = interpolate(
            translationX,
            [0, SCREEN_WIDTH * 0.3],
            [0.9, 1], // 从 0.9 放大到 1
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            translationX,
            [0, SCREEN_WIDTH * 0.3],
            [0.6, 1], // 透明度从 0.6 变到 1
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    function handleSwipe() {
        setCurrentIndex((prev) => prev + 1);
    }

    function pressedReset() {
        setCurrentIndex(0);
    }

    useEffect(() => {
        sharedTranslateX.value = 0;
    }, [currentIndex, sharedTranslateX]);

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 justify-center items-center bg-neutral-100 relative">

                {/* --- A. 底层卡片 (Next Card) --- */}
                {nextCard && (
                    <BackgroundCard
                        card={nextCard}
                        style={nextCardStyle}
                        zIndex={CARD_Z_INDEX.BACKGROUND}
                    />
                )}

                {/* --- B. 顶层卡片 (Active Card) --- */}
                {activeCard ? (
                    <SwipeableCard
                        key={activeCard.id}
                        card={activeCard}
                        onSwipe={handleSwipe}
                        sharedTranslateX={sharedTranslateX}
                        zIndex={CARD_Z_INDEX.FOREGROUND}
                    />
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
