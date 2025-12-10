import React from 'react';
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

    // 2. Color Interpolation
    const colorProgress = useSharedValue(0);

    // 3. 3D Rotation
    const rotateProgress = useSharedValue(0);

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
    const boxStyle = useAnimatedStyle(() => {
        // TODO: 在这里实现你的代码
        return {};
    });

    // 练习 2：颜色插值
    // 任务：
    // 使用 interpolateColor 将 0-1 的输入映射到两种颜色之间 (例如 'blue' -> 'red')
    // 同时让宽度从 100 变到 200
    const colorStyle = useAnimatedStyle(() => {
        // TODO: 在这里实现你的代码
        return {};
    });

    // 练习 3：旋转动画
    // 任务：
    // 将 0-1 的输入映射到 0deg -> 360deg 的旋转角度
    // 提示：transform: [{ rotate: `${degrees}deg` }]
    const rotateStyle = useAnimatedStyle(() => {
        // TODO: 在这里实现你的代码
        return {};
    });

    // 练习 4：滚动视差 (高级)
    // 任务：
    // 1. 监听滚动事件，获取 scrollX
    // 2. 为每个卡片计算 inputRange (基于 index 和卡片宽度)
    // 3. 实现中间卡片放大(scale 1)，两边卡片缩小(scale 0.8)的效果
    const items = [0, 1, 2, 3, 4];

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
                            value={progress.value === 1}
                            onValueChange={(v) => { progress.value = withSpring(v ? 1 : 0); }}
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
                            value={colorProgress.value === 1}
                            onValueChange={(v) => { colorProgress.value = withTiming(v ? 1 : 0); }}
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
                            value={rotateProgress.value === 1}
                            onValueChange={(v) => { rotateProgress.value = withSpring(v ? 1 : 0); }}
                        />
                    </View>
                    <Text className="text-xs text-slate-400 mt-2">
                        Input [0, 1] {'->'} Rotate [0deg, 360deg]
                    </Text>
                </Section>

                {/* Exercise 4: Scroll Interpolation */}
                <Section title="4. Scroll Interpolation (Parallax)">
                    <Animated.ScrollView
                        horizontal
                        pagingEnabled
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        className="w-full h-40"
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {items.map((_, index) => {
                            // TODO: 在这里实现每个卡片的动画样式
                            // 提示：你需要根据 index 计算当前卡片的中心点位置
                            const style = useAnimatedStyle(() => {
                                return {};
                            });

                            return (
                                <View key={index} style={{ width: width * 0.7, padding: 10 }}>
                                    <Animated.View
                                        className="flex-1 bg-indigo-500 rounded-2xl items-center justify-center shadow-lg overflow-hidden"
                                        style={style}
                                    >
                                        <Text className="text-white text-3xl font-bold">{index + 1}</Text>
                                        <Animated.Text className="text-white/80 mt-2">
                                            Card {index + 1}
                                        </Animated.Text>
                                    </Animated.View>
                                </View>
                            );
                        })}
                    </Animated.ScrollView>
                    <Text className="text-xs text-slate-400 mt-2 text-center">
                        Scroll horizontally to see Scale & Opacity changes
                    </Text>
                </Section>
            </ScrollView>
        </View>
    );
}
