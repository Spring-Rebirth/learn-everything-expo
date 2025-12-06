import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../providers/ThemeProvider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_VISIBLE_HEIGHT = 100;
const SPRING_CONFIG = { damping: 20, stiffness: 200, overshootClamping: false };

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export default function BottomSheetLab() {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const startY = useSharedValue(0);
  const sheetHeight = useSharedValue(0);

  const colors = useMemo(
    () => ({
      background: isDark ? '#0f172a' : '#f8fafc',
      card: isDark ? '#111827' : '#ffffff',
      text: isDark ? '#e5e7eb' : '#0f172a',
      muted: isDark ? '#cbd5e1' : '#475569',
      border: isDark ? '#1f2937' : '#e2e8f0',
      dragHandle: isDark ? '#334155' : '#cbd5e1',
      primary: isDark ? '#0f766e' : '#10b981',
      secondary: isDark ? '#1d4ed8' : '#2563eb',
      danger: isDark ? '#b91c1c' : '#ef4444',
    }),
    [isDark],
  );

  const getSnapPoints = (h: number) => {
    'worklet';
    if (h === 0) return { expanded: 0, mid: 0, collapsed: 0 };

    // collapsed: 向下移动最大距离，保留 MIN_VISIBLE_HEIGHT + insets.bottom
    // expanded: 0 (完全展示)

    const maxTranslate = Math.max(0, h - MIN_VISIBLE_HEIGHT - insets.bottom);
    return {
      expanded: 0,
      mid: maxTranslate * 0.5,
      collapsed: maxTranslate,
    };
  };

  const handleLayout = (event: any) => {
    const h = event.nativeEvent.layout.height;
    if (h > 0 && h !== sheetHeight.value) {
      sheetHeight.value = h;
      // Initialize position only once
      if (!isReady) {
        // Initial position: Collapsed
        const points = getSnapPoints(h);
        // We use runOnJS to update state, but we can set shared value directly
        translateY.value = points.mid; // Start at mid
        runOnJS(setIsReady)(true);
      }
    }
  };

  const snapTo = (key: 'expanded' | 'mid' | 'collapsed') => {
    const points = getSnapPoints(sheetHeight.value);
    translateY.value = withSpring(points[key], SPRING_CONFIG);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startY.value = translateY.value;
        })
        .onUpdate((event) => {
          const points = getSnapPoints(sheetHeight.value);
          const nextValue = startY.value + event.translationY;
          // allow some overdrag at top (negative values)
          translateY.value = clamp(nextValue, -50, points.collapsed + 50);
        })
        .onEnd((event) => {
          const points = getSnapPoints(sheetHeight.value);
          const projected = translateY.value + event.velocityY * 0.2;

          const snapTargets = Object.values(points);

          // Find closest snap point
          let closest = snapTargets[0];
          let minDistance = Infinity;

          for (const target of snapTargets) {
            const distance = Math.abs(target - projected);
            if (distance < minDistance) {
              minDistance = distance;
              closest = target;
            }
          }

          translateY.value = withSpring(closest, SPRING_CONFIG);
        }),
    [insets.bottom],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: isReady ? 1 : 0,
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="p-6">
        <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
          Reanimated Bottom Sheet
        </Text>
        <Text style={{ color: colors.muted }}>
          优化后的 Bottom Sheet：
        </Text>
        <View className="ml-2 mt-2">
          <Text style={{ color: colors.muted }}>1. 动态高度计算，适配不同内容</Text>
          <Text style={{ color: colors.muted }}>2. 适配 Safe Area</Text>
          <Text style={{ color: colors.muted }}>3. 修复初始闪烁问题</Text>
          <Text style={{ color: colors.muted }}>4. 优化手势体验</Text>
        </View>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View
          className="absolute left-0 right-0"
          onLayout={handleLayout}
          style={[
            {
              bottom: 0,
              backgroundColor: colors.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: Math.max(24, insets.bottom), // Ensure bottom padding accounts for insets when expanded
              borderWidth: 1,
              borderColor: colors.border,
              // Shadow for better visibility
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            },
            sheetStyle,
          ]}
        >
          <View className="items-center mb-4">
            <View
              style={{
                width: 56,
                height: 6,
                borderRadius: 999,
                backgroundColor: colors.dragHandle,
              }}
            />
            <Text className="mt-2 font-semibold" style={{ color: colors.text }}>
              向上/向下拖拽，或点击按钮吸附
            </Text>
          </View>

          <View className="flex-row justify-between mb-3 gap-2">
            <Pressable
              onPress={() => snapTo('expanded')}
              className="flex-1 px-4 py-3 rounded-xl active:opacity-80"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-center font-semibold text-white">展开</Text>
            </Pressable>
            <Pressable
              onPress={() => snapTo('mid')}
              className="flex-1 px-4 py-3 rounded-xl active:opacity-80"
              style={{ backgroundColor: colors.secondary }}
            >
              <Text className="text-center font-semibold text-white">中间</Text>
            </Pressable>
            <Pressable
              onPress={() => snapTo('collapsed')}
              className="flex-1 px-4 py-3 rounded-xl active:opacity-80"
              style={{ backgroundColor: colors.danger }}
            >
              <Text className="text-center font-semibold text-white">收起</Text>
            </Pressable>
          </View>

          <View className="mt-2 pb-8">
            <Text className="font-semibold mb-2" style={{ color: colors.text }}>
              面板内容示例
            </Text>
            <Text style={{ color: colors.muted }} className="mb-4">
              这里的内容高度可以任意变化，Bottom Sheet 会自动计算合适的吸附点。
              尝试添加更多内容或改变设备方向，布局依然保持稳定。
            </Text>
            <View className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg w-full mb-2" />
            <View className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg w-full" />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
