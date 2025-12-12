import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, Switch } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    withSpring,
    withTiming,
    interpolateColor,
    useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FloatingBackButton } from '../../components/playground/FloatingBackButton';

const { width } = Dimensions.get('window');

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
        <Text className="text-lg font-bold mb-4 text-slate-800">{title}</Text>
        <View className="items-center justify-center py-4">
            {children}
        </View>
    </View>
);

export default function InterpolateLab() {
    const insets = useSafeAreaInsets();

    // 1. Basic Opacity & Scale
    const progress = useSharedValue(0);
    const [isProgressEnabled, setIsProgressEnabled] = useState(false);

    // 2. Color Interpolation
    const colorProgress = useSharedValue(0);
    const [isColorEnabled, setIsColorEnabled] = useState(false);

    // 3. 3D Rotation
    const rotateProgress = useSharedValue(0);
    const [isRotateEnabled, setIsRotateEnabled] = useState(false);

    // 4. Scroll Interpolation
    const scrollX = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    // --- 练习区域 ---

    // 练习 1：基础插值
    // 任务：
    // 1. 创建一个新的 sharedValue (例如 progress1)
    // 2. 使用 interpolate 将 0-1 的输入映射到：
    //    - 缩放 (scale): 1 -> 1.5
    //    - 透明度 (opacity): 0.5 -> 1
    //    - 圆角 (borderRadius): 10 -> 50

    /**
     * 反例说明
     * 在 useAnimatedStyle 中给 shared values 赋值，然后在返回对象中读取它们，
     * 这不符合 useAnimatedStyle 的用法。useAnimatedStyle 应基于 shared values
     * 计算样式，而不是修改 shared values。
     */
    const boxStyle = useAnimatedStyle(() => {
        return {
            scale: interpolate(
                progress.value,
                [0, 1],
                [1, 1.5],
                Extrapolation.CLAMP,
            ),
            opacity: interpolate(
                progress.value,
                [0, 1],
                [0.5, 1],
                Extrapolation.CLAMP,
            ),
            borderRadius: interpolate(
                progress.value,
                [0, 1],
                [10, 50],
                Extrapolation.CLAMP,
            ),
        };
    });

    // 练习 2：颜色插值
    // 任务：
    // 使用 interpolateColor 将 0-1 的输入映射到两种颜色之间 (例如 'blue' -> 'red')
    // 同时让宽度从 100 变到 200
    const colorStyle = useAnimatedStyle(() => {
        // TODO: 在这里实现你的代码
        return {
            // 注意：不能用color，这是用于文本颜色的
            backgroundColor: interpolateColor(
                colorProgress.value,
                [0, 1],
                ["blue", "red"],
                "RGB",
            ),
            width: interpolate(
                colorProgress.value,
                [0, 1],
                [100, 200],
                Extrapolation.CLAMP,
            ),
        };
    });

    // 练习 3：旋转动画
    // 任务：
    // 将 0-1 的输入映射到 0deg -> 360deg 的旋转角度
    // 提示：transform: [{ rotate: `${degrees}deg` }]
    const rotateStyle = useAnimatedStyle(() => {
        // TODO: 在这里实现你的代码
        const degrees = interpolate(
            rotateProgress.value,
            [0, 1],
            [0, 360],
            Extrapolation.CLAMP,
        );

        return {
            transform: [{ rotate: `${degrees}deg` }]
        };
    });

    // 练习 4：滚动视差 (高级)
    // 任务：
    // 1. 监听滚动事件，获取 scrollX
    // 2. 为每个卡片计算 inputRange (基于 index 和卡片宽度)
    // 3. 实现中间卡片放大(scale 1)，两边卡片缩小(scale 0.8)的效果
    const items = [0, 1, 2, 3, 4];

    // 修正：基于 Section 的实际可用宽度计算，而不是全屏宽度
    // ScrollView padding: 20 * 2 = 40
    // Section padding: 16 * 2 = 32
    const SECTION_WIDTH = width - 40 - 32;
    const CARD_WIDTH = SECTION_WIDTH * 0.75;
    const CARD_SPACING = (SECTION_WIDTH - CARD_WIDTH) / 2;

    return (
        <View className="flex-1 bg-slate-50">
            <FloatingBackButton />
            <ScrollView
                className="flex-1 bg-slate-50"
                contentContainerStyle={{ padding: 20, paddingBottom: 100, paddingTop: insets.top + 60 }}
            >
                <Text className="text-slate-500 mb-6 italic">
                    Exercises for interpolate() and interpolateColor()
                </Text>

                {/* Exercise 1: Basic Interpolation */}
                <Section title="1. Scale, Opacity & Radius">
                    <Animated.View
                        style={[{ width: 100, height: 100, backgroundColor: '#8b5cf6' }, boxStyle]}
                    />
                    <View className="mt-4 flex-row items-center gap-2">
                        <Text>Toggle Effect</Text>
                        <Switch
                            value={isProgressEnabled}
                            onValueChange={(v) => {
                                setIsProgressEnabled(v);
                                progress.value = withSpring(v ? 1 : 0);
                            }}
                        />
                    </View>
                    <Text className="text-xs text-slate-400 mt-2">
                        Input [0, 1] {'->'} Scale [1, 1.5], Opacity [0.5, 1], Radius [10, 50]
                    </Text>
                </Section>

                {/* Exercise 2: Color Interpolation */}
                <Section title="2. Color & Width">
                    <Animated.View
                        style={[{ height: 60, borderRadius: 10 }, colorStyle]}
                    />
                    <View className="mt-4 flex-row items-center gap-2">
                        <Text>Change Color</Text>
                        <Switch
                            value={isColorEnabled}
                            onValueChange={(v) => {
                                setIsColorEnabled(v);
                                colorProgress.value = withTiming(v ? 1 : 0);
                            }}
                        />
                    </View>
                    <Text className="text-xs text-slate-400 mt-2">
                        Input [0, 1] {'->'} Color [Blue, Red], Width [100, 200]
                    </Text>
                </Section>

                {/* Exercise 3: Rotation (Infinite loop logic possible, but here simple toggle) */}
                <Section title="3. Rotation (Deg)">
                    <Animated.View
                        style={[{ width: 80, height: 80, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' }, rotateStyle]}
                    >
                        <Text className="text-white font-bold">SPIN</Text>
                    </Animated.View>
                    <View className="mt-4 flex-row items-center gap-2">
                        <Text>Spin 360</Text>
                        <Switch
                            value={isRotateEnabled}
                            onValueChange={(v) => {
                                setIsRotateEnabled(v);
                                rotateProgress.value = withSpring(v ? 1 : 0);
                            }}
                        />
                    </View>
                    <Text className="text-xs text-slate-400 mt-2">
                        Input [0, 1] {'->'} Rotate [0deg, 360deg]
                    </Text>
                </Section>

                {/* Exercise 4: 3D Cover Flow */}
                <Section title="4. 3D Cover Flow (Advanced)">
                    <Animated.ScrollView
                        horizontal
                        // 使用 snapToInterval 替代 pagingEnabled 以支持非全屏宽度的卡片居中
                        snapToInterval={CARD_WIDTH}
                        decelerationRate="fast"
                        disableIntervalMomentum={true}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        className="w-full py-4"
                        // 确保第一个和最后一个卡片能居中
                        contentContainerStyle={{
                            alignItems: 'center',
                            paddingHorizontal: CARD_SPACING
                        }}
                    >
                        {items.map((_, index) => {
                            // TODO: 实现 3D Cover Flow 效果
                            // 1. 计算 input range: [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH]
                            const inputRange = [
                                (index - 1) * CARD_WIDTH,
                                index * CARD_WIDTH,
                                (index + 1) * CARD_WIDTH,
                            ];

                            // 2. 使用 interpolate 实现:
                            //    - scale: 中间 1，两边 0.9
                            //    - rotateY: 左边 '30deg'，中间 '0deg'，右边 '-30deg'
                            //    - opacity: 中间 1，两边 0.8
                            const style = useAnimatedStyle(() => {
                                const scale = interpolate(
                                    scrollX.value,
                                    inputRange,
                                    [0.9, 1, 0.9],
                                    Extrapolation.CLAMP,
                                );

                                const rotateY = interpolate(
                                    scrollX.value,
                                    inputRange,
                                    [30, 0, -30], // 注意方向：左边(index-1)通常需要正角度或负角度取决于视觉需求
                                    Extrapolation.CLAMP
                                );

                                const opacity = interpolate(
                                    scrollX.value,
                                    inputRange,
                                    [0.8, 1, 0.8],
                                    Extrapolation.CLAMP
                                );

                                return {
                                    opacity: opacity,
                                    transform: [
                                        { perspective: 1000 },
                                        { scale: scale },
                                        { rotateY: `${rotateY}deg` }
                                    ]
                                };
                            });

                            return (
                                <View key={index} style={{ width: CARD_WIDTH }}>
                                    <Animated.View
                                        className="mx-4 h-64 bg-indigo-500 rounded-2xl items-center justify-center shadow-xl border border-indigo-400"
                                        style={style}
                                    >
                                        <Text className="text-white text-4xl font-bold">{index + 1}</Text>
                                        <Animated.Text className="text-indigo-100 mt-2 font-medium">
                                            Cover Flow
                                        </Animated.Text>
                                    </Animated.View>
                                </View>
                            );
                        })}
                    </Animated.ScrollView>
                    <Text className="text-xs text-slate-400 mt-4 text-center px-8">
                        Challenge: Implement a 3D rotation effect where side cards rotate inwards like a cover flow.
                    </Text>
                </Section>
            </ScrollView>
        </View>
    );
}