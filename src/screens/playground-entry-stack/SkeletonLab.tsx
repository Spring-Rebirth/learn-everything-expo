import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FloatingBackButton } from '../../components/playground/FloatingBackButton';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate
} from 'react-native-reanimated';

// 1. 创建动画化的 LinearGradient 组件
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SkeletonLab() {
  // 2. 动画共享值 (0 -> 1)
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }), // 1.5秒完成一次扫描
      -1, // 无限循环
      false // 不反向播放
    );
  }, []);

  // 3. 定义光影的动画样式 (从左向右平移)
  const rStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-SCREEN_WIDTH, SCREEN_WIDTH]
    );
    return {
      transform: [{ translateX }],
    };
  });

  // 4. 定义骨架屏的形状 (Mask Element)
  // 注意：在这里背景色要是黑色(或不透明)，透明部分会被遮挡
  const SkeletonLayout = (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {/* 模拟 Header / Avatar 区域 */}
      <View className="flex-row items-center mb-6">
        <View className="w-16 h-16 rounded-full bg-black mr-4" />
        <View>
          <View className="w-32 h-5 bg-black rounded mb-2" />
          <View className="w-20 h-4 bg-black rounded" />
        </View>
      </View>

      {/* 模拟文章段落 */}
      <View className="gap-y-3">
        <View className="w-full h-4 bg-black rounded" />
        <View className="w-full h-4 bg-black rounded" />
        <View className="w-3/4 h-4 bg-black rounded" />
      </View>

      {/* 模拟另一个块 */}
      <View className="mt-8 gap-y-3">
        <View className="w-full h-40 bg-black rounded-xl" />
        <View className="w-1/2 h-4 bg-black rounded" />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <FloatingBackButton />

      <View className="flex-1 p-6 justify-center">

        <View className="items-center mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-2">Skeleton Loading</Text>
          <Text className="text-sm text-gray-500">MaskedView + Reanimated</Text>
        </View>

        {/* 5. 核心 MaskedView 实现 */}
        <MaskedView
          style={{ height: 400, width: '100%' }}
          maskElement={SkeletonLayout} // 遮罩层（形状）
        >
          {/* 背景层 (灰色底) */}
          <View style={{ flex: 1, backgroundColor: '#E5E7EB' }} />

          {/* 动画层 (高亮光影) */}
          <AnimatedLinearGradient
            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, rStyle]}
          />
        </MaskedView>

      </View>
    </View>
  );
}