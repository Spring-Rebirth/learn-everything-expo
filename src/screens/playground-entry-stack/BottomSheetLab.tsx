import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMemo } from 'react';
import { useThemeContext } from '../../providers/ThemeProvider';

const { height } = Dimensions.get('window');
// 三个吸附点，单位为向下的位移，超出面板高度会被动态收敛
const SNAP_POINTS = [80, height * 0.35, height * 0.7];

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export default function BottomSheetLab() {
  const { isDark } = useThemeContext();
  const translateY = useSharedValue(SNAP_POINTS[1]);
  const startY = useSharedValue(SNAP_POINTS[1]);
  const sheetHeight = useSharedValue(0);

  const getClamped = (value: number) => {
    'worklet';
    const maxTranslate = sheetHeight.value > 0 ? Math.min(SNAP_POINTS[2], sheetHeight.value - 32) : SNAP_POINTS[2];
    return clamp(value, SNAP_POINTS[0], maxTranslate);
  };

  useAnimatedReaction(
    () => sheetHeight.value,
    (h) => {
      if (!h) return;
      const maxTranslate = Math.min(SNAP_POINTS[2], h - 32);
      if (translateY.value > maxTranslate) {
        translateY.value = withSpring(maxTranslate, {
          damping: 18,
          stiffness: 200,
          overshootClamping: true,
        });
        startY.value = maxTranslate;
      }
    },
  );

  const snapTo = (value: number) => {
    const clamped = getClamped(value);
    translateY.value = withSpring(clamped, {
      damping: 18,
      stiffness: 200,
      overshootClamping: true,
    });
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startY.value = translateY.value;
        })
        .onUpdate((event) => {
          translateY.value = getClamped(startY.value + event.translationY);
        })
        .onEnd((event) => {
          const projected = translateY.value + event.velocityY * 0.1;
          'worklet';
          const closest = SNAP_POINTS.reduce((prev, curr) =>
            Math.abs(curr - projected) < Math.abs(prev - projected) ? curr : prev
          );
          const clamped = getClamped(closest);
          translateY.value = withSpring(clamped, { damping: 18, stiffness: 200 });
        }),
    [],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bg = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const textColor = isDark ? '#e5e7eb' : '#0f172a';
  const muted = isDark ? '#cbd5e1' : '#475569';

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <View className="p-6">
        <Text className="text-2xl font-bold mb-2" style={{ color: textColor }}>
          Reanimated Bottom Sheet
        </Text>
        <Text style={{ color: muted }}>
          通过 Gesture Handler + Reanimated 实现可拖拽底部弹窗，包含三个吸附点。
        </Text>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View
          className="absolute left-0 right-0"
          onLayout={({ nativeEvent }) => {
            sheetHeight.value = nativeEvent.layout.height;
          }}
          style={[
            {
              bottom: 0,
              backgroundColor: cardBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 24,
              borderWidth: 1,
              borderColor: isDark ? '#1f2937' : '#e2e8f0',
            },
            sheetStyle,
          ]}
        >
          <View className="items-center mb-4">
            <View style={{ width: 56, height: 6, borderRadius: 999, backgroundColor: isDark ? '#334155' : '#cbd5e1' }} />
            <Text className="mt-2 font-semibold" style={{ color: textColor }}>
              向上/向下拖拽，或点击按钮吸附
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Pressable
              onPress={() => snapTo(SNAP_POINTS[0])}
              className="flex-1 mr-2 px-4 py-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#0f766e' : '#10b981' }}
            >
              <Text className="text-center font-semibold text-white">展开</Text>
            </Pressable>
            <Pressable
              onPress={() => snapTo(SNAP_POINTS[1])}
              className="flex-1 px-4 py-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
            >
              <Text className="text-center font-semibold text-white">中间</Text>
            </Pressable>
            <Pressable
              onPress={() => snapTo(SNAP_POINTS[2])}
              className="flex-1 ml-2 px-4 py-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#b91c1c' : '#ef4444' }}
            >
              <Text className="text-center font-semibold text-white">收起</Text>
            </Pressable>
          </View>

          <View className="mt-2">
            <Text className="font-semibold mb-2" style={{ color: textColor }}>
              面板内容示例
            </Text>
            <Text style={{ color: muted }}>
              可以放置表单、过滤器、评论等任何内容。当前示例演示三段吸附，并使用 withSpring 产生平滑动效。
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

