import { View, Text, Image, Pressable, Dimensions, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  SharedTransition,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { imageAssets } from "../../constant/imageAssets";

const imagesMap: Record<string, any> = {
  a: imageAssets.nature1,
  b: imageAssets.nature2,
  c: imageAssets.nature3,
  d: imageAssets.nature1,
  e: imageAssets.nature2,
  f: imageAssets.nature3,
};

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 拖动关闭的阈值
const DISMISS_THRESHOLD = 150;

// 图片使用弹性过渡动画（与列表页保持一致）
const imageTransition = SharedTransition
  .springify()
  .damping(18)
  .stiffness(120)
  .mass(0.8);

export default function SharedBoundsDetail({ route, navigation }: any) {
  const { id } = route.params;
  const image = imagesMap[id] ?? imageAssets.nature1;
  const detailImageHeight = SCREEN_WIDTH * 0.66;

  // 拖动的 Y 偏移量
  const translateY = useSharedValue(0);
  // 拖动的 X 偏移量（可选，用于更自然的拖动效果）
  const translateX = useSharedValue(0);

  const goBack = () => {
    navigation.goBack();
  };

  // 拖动手势
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 只允许向下拖动
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        translateX.value = event.translationX * 0.5; // X 方向跟随但幅度减半
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        // 超过阈值，关闭页面
        runOnJS(goBack)();
      } else {
        // 未超过阈值，弹回原位
        translateY.value = withTiming(0, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  // 内容区域的动画样式
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT],
      [1, 0.85],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale },
      ],
      borderRadius: interpolate(
        translateY.value,
        [0, 50],
        [0, 24],
        Extrapolation.CLAMP
      ),
    };
  });

  // 背景遮罩的动画样式
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, DISMISS_THRESHOLD * 2],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity * 0.5})`,
    };
  });

  return (
    <View style={styles.container}>
      {/* 背景遮罩层 */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />

      {/* 可拖动的内容区域 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={{ position: 'relative' }}>
            <AnimatedImage
              sharedTransitionTag={`image-${id}`}
              source={image}
              style={{
                width: SCREEN_WIDTH,
                height: detailImageHeight,
              }}
              resizeMode="cover"
            />
            <Animated.View
              entering={FadeIn.delay(250).duration(300)}
              style={{
                position: 'absolute',
                top: 56,
                left: 16,
                zIndex: 10,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 9999,
                }}
                onPress={goBack}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>Back</Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* 这里可以添加更多详情内容 */}
          <View style={styles.detailContent}>
            <Text style={styles.hint}>向下拖动关闭</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  detailContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    paddingTop: 32,
  },
  hint: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
