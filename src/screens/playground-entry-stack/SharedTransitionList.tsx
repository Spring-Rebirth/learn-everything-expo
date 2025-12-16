import { View, Image, Pressable, Dimensions } from "react-native";
import { imageAssets } from "../../constant/imageAssets";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
const items = [
  { id: 'a', image: imageAssets.nature1 },
  { id: 'b', image: imageAssets.nature2 },
  { id: 'c', image: imageAssets.nature3 },
  { id: 'd', image: imageAssets.nature1 },
  { id: 'e', image: imageAssets.nature2 },
  { id: 'f', image: imageAssets.nature3 },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SharedTransitionList({ navigation }: any) {
  const listImageWidth = SCREEN_WIDTH - 32; // px-4 = 16px * 2
  const listImageHeight = 192; // h-48 = 192px

  // 定义手势：向右快速滑动 (Fling Right)
  const flingGesture = Gesture.Fling()
    .direction(Directions.RIGHT) // 限制只有向右滑才触发
    .onEnd(() => {
      // 触发导航返回
      scheduleOnRN(navigation.goBack);
    });

  return (
    <GestureDetector gesture={flingGesture}>
      <View className="bg-slate-50 flex-1 px-4">
        <Animated.ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, marginTop: 10 }}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => navigation.navigate(
                'SharedTransitionDetail',
                { id: item.id },
              )}
            >
              <AnimatedImage
                sharedTransitionTag={`image-${item.id}`}
                source={item.image}
                style={{
                  width: listImageWidth,
                  height: listImageHeight,
                  borderRadius: 16,
                  marginBottom: 26,
                }}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </Animated.ScrollView>
      </View>
    </GestureDetector>
  );
}
