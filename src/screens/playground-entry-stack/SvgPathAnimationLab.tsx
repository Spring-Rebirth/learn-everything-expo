import { View, Text, Button, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useThemeContext } from '../../providers/ThemeProvider';

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function SvgPathAnimationLab() {
  const { isDark } = useThemeContext();
  const progress = useSharedValue(0);

  // TODO: 定义 SVG 路径数据
  // const startPath = "...";
  // const endPath = "...";

  const animatedProps = useAnimatedProps(() => {
    // TODO: 插值计算 path d 属性
    // 注意：Reanimated 直接插值 path string 比较复杂，通常建议使用 interpolatePath (若有) 
    // 或者确保两个 path 的命令数量和类型一致，以便底层进行数值插值。
    // 这里作为一个简单的 start point，可以先演示 strokeDashoffset 动画。
    return {
      strokeDashoffset: 1000 * (1 - progress.value),
    };
  });

  const handleAnimate = () => {
    progress.value = withTiming(progress.value === 1 ? 0 : 1, {
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
    });
  };

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <Text className="text-xl font-bold mb-8" style={{ color: isDark ? '#fff' : '#000' }}>
        SVG Path Animation
      </Text>

      <View className="items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <Svg width={width - 64} height={200} viewBox="0 0 300 200">
          {/* TODO: 添加 Path 组件并应用 animatedProps */}
          {/* 示例：描边动画 */}
          <AnimatedPath
            d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
            stroke={isDark ? "#38bdf8" : "#0284c7"}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={1000}
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      <View className="mt-8">
        <Button title="Trigger Animation" onPress={handleAnimate} />
      </View>
    </View>
  );
}

