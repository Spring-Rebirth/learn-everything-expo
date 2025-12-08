import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    withTiming,
    Easing,
    SharedValue,
    Extrapolation,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const CARDS = [
    { id: '1', text: 'Emma', color: '#FF6B6B', uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop' },
    { id: '2', text: 'Olivia', color: '#4ECDC4', uri: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2080&auto=format&fit=crop' },
    { id: '3', text: 'Ava', color: '#45B7D1', uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    { id: '4', text: 'Isabella', color: '#96CEB4', uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2070&auto=format&fit=crop' },
    { id: '5', text: 'Sophia', color: '#D4A5A5', uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' },
    { id: '6', text: 'Mia', color: '#F0F0F0', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
];

const CardContent = ({ card }: { card: typeof CARDS[0] }) => {
    return (
        <View style={[styles.card, { backgroundColor: 'white' }]}>
            <Image
                source={card.uri}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
            />
            <View style={styles.footer}>
                <Text style={styles.text}>{card.text}</Text>
                <Text style={styles.subText}>24岁 • 纽约</Text>
            </View>
            <View style={styles.overlay} />
        </View>
    );
};

const SwipeableCard = ({
    card,
    index,
    currentIndex,
    activeTranslation, // 传入的 SharedValue，属于当前 Slot
    otherTranslation,  // 传入的 SharedValue，属于另一个 Slot
    onSwipeComplete,
}: {
    card: typeof CARDS[0],
    index: number,
    currentIndex: number,
    activeTranslation: SharedValue<number>,
    otherTranslation: SharedValue<number>,
    onSwipeComplete: () => void,
}) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        // 当数据源(card.id)发生变化时，说明Slot被分配了新的卡片，必须重置位置。
        // 无论是Reset还是正常轮播到下一张，只要ID变了，都需要归零。
        activeTranslation.value = 0;
        translateY.value = 0;
    }, [card.id]); // 依赖项调整

    const isTop = index === currentIndex;
    const isNext = index === currentIndex + 1;
    const isVisible = isTop || isNext;

    const panGesture = Gesture.Pan()
        .enabled(isTop)
        .onUpdate((event) => {
            activeTranslation.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            if (Math.abs(activeTranslation.value) > SWIPE_THRESHOLD) {
                const direction = activeTranslation.value > 0 ? 1 : -1;
                activeTranslation.value = withTiming(
                    direction * SCREEN_WIDTH * 1.5,
                    { duration: 300, easing: Easing.out(Easing.cubic) },
                    () => {
                        scheduleOnRN(onSwipeComplete);
                    }
                );
                translateY.value = withTiming(translateY.value + 100, { duration: 300 });
            } else {
                activeTranslation.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const cardStyle = useAnimatedStyle(() => {
        // 如果我是 Top，用我自己的 translation 旋转
        // 如果我是 Next，我也许不需要旋转，或者轻微旋转
        const currentTranslateX = activeTranslation.value;

        const rotate = interpolate(
            currentTranslateX,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-15, 0, 15],
            Extrapolation.CLAMP
        );

        // 缩放逻辑：
        // 如果我是 Next，我需要根据 Top 的移动来缩放。
        // Top 的移动存储在 otherTranslation 中。
        let scale = 1;
        if (isNext) {
            scale = interpolate(
                Math.abs(otherTranslation.value),
                [0, SWIPE_THRESHOLD * 2],
                [0.95, 1], // 从 0.95 放大到 1
                Extrapolation.CLAMP
            );
        } else if (!isTop) {
            // 更后面的卡片
            scale = 0.95;
        }

        return {
            transform: [
                { translateX: currentTranslateX },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
                { scale },
            ],
            zIndex: isTop ? 100 : 1,
            opacity: isVisible ? 1 : 0,
        };
    });

    const likeStyle = useAnimatedStyle(() => ({
        opacity: isTop ? interpolate(activeTranslation.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP) : 0
    }));

    const nopeStyle = useAnimatedStyle(() => ({
        opacity: isTop ? interpolate(activeTranslation.value, [-SCREEN_WIDTH / 4, 0], [1, 0], Extrapolation.CLAMP) : 0
    }));

    if (!card) return null;

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.center, { zIndex: isTop ? 100 : 0 }]}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.center, cardStyle]}>
                    <CardContent card={card} />

                    <Animated.View style={[styles.labelContainer, styles.likeLabel, likeStyle]}>
                        <Text style={styles.likeText}>LIKE</Text>
                    </Animated.View>
                    <Animated.View style={[styles.labelContainer, styles.nopeLabel, nopeStyle]}>
                        <Text style={styles.nopeText}>NOPE</Text>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export default function TinderSwipe() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 创建两个 Slot 的 SharedValue
    const translationSlot0 = useSharedValue(0);
    const translationSlot1 = useSharedValue(0);

    useEffect(() => {
        const nextCard = CARDS[currentIndex + 1];
        if (nextCard) Image.prefetch(nextCard.uri);
        const nextNextCard = CARDS[currentIndex + 2];
        if (nextNextCard) Image.prefetch(nextNextCard.uri);
    }, [currentIndex]);

    const handleSwipeComplete = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const animateSwipe = (direction: 'left' | 'right') => {
        if (currentIndex >= CARDS.length) return;

        const activeSlot = currentIndex % 2;
        const activeTranslation = activeSlot === 0 ? translationSlot0 : translationSlot1;
        const target = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

        activeTranslation.value = withTiming(
            target,
            { duration: 500, easing: Easing.out(Easing.cubic) },
            () => {
                scheduleOnRN(handleSwipeComplete);
            }
        );
    };

    const renderSlot = (slotIndex: number) => {
        let cardIndexToShow = -1;

        if (currentIndex % 2 === slotIndex) {
            cardIndexToShow = currentIndex;
        } else {
            cardIndexToShow = currentIndex + 1;
        }

        const card = CARDS[cardIndexToShow];

        if (!card && cardIndexToShow !== currentIndex) return null;

        // 确定传哪个 SharedValue
        const activeTranslation = slotIndex === 0 ? translationSlot0 : translationSlot1;
        const otherTranslation = slotIndex === 0 ? translationSlot1 : translationSlot0;

        return (
            <SwipeableCard
                key={`slot-${slotIndex}`}
                card={card}
                index={cardIndexToShow}
                currentIndex={currentIndex}
                activeTranslation={activeTranslation}
                otherTranslation={otherTranslation}
                onSwipeComplete={handleSwipeComplete}
            />
        );
    };

    if (currentIndex >= CARDS.length) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>No more profiles!</Text>
                <Text style={styles.subText} onPress={() => setCurrentIndex(0)}>Reset</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardStack}>
                {renderSlot(0)}
                {renderSlot(1)}
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.nopeAction]}
                    activeOpacity={0.8}
                    onPress={() => animateSwipe('left')}
                >
                    <Text style={[styles.actionText, styles.nopeActionText]}>NOPE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.likeAction]}
                    activeOpacity={0.8}
                    onPress={() => animateSwipe('right')}
                >
                    <Text style={[styles.actionText, styles.likeActionText]}>LIKE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardStack: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.6,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '85%',
    },
    footer: {
        height: '15%',
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    labelContainer: {
        position: 'absolute',
        top: 40,
        paddingHorizontal: 20,
        borderWidth: 4,
        borderRadius: 10,
        zIndex: 101,
    },
    likeLabel: {
        left: 40,
        borderColor: '#4ECDC4',
        transform: [{ rotate: '-15deg' }],
    },
    nopeLabel: {
        right: 40,
        borderColor: '#FF6B6B',
        transform: [{ rotate: '15deg' }],
    },
    likeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4ECDC4',
    },
    nopeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 8,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    actionText: {
        fontSize: 20,
        fontWeight: '700',
    },
    nopeAction: {
        backgroundColor: '#FFE5E5',
    },
    likeAction: {
        backgroundColor: '#E6F8F4',
    },
    nopeActionText: {
        color: '#FF6B6B',
    },
    likeActionText: {
        color: '#4ECDC4',
    },
});
