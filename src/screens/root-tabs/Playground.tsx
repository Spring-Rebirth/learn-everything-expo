import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";
import { PlaygroundEntryStackParamList } from "../../navigation/PlaygroundEntryStack";

type PageItem = {
  id: string;
  name: string;
  destination: keyof PlaygroundEntryStackParamList;
};

export default function Playground() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pageList: PageItem[] = [
    {
      id: 'lab-notif',
      name: '通知实验室 (Expo Notifications)',
      destination: 'NotificationsLab'
    },
    {
      id: 'lab-camera',
      name: '相机实验室 (Expo Camera)',
      destination: 'CameraLab'
    },
    {
      id: 'lab-bottom-sheet',
      name: '可拖拽 Bottom Sheet',
      destination: 'BottomSheetLab'
    },
    {
      id: 'lab-masonry',
      name: 'Masonry FlashList 瀑布流',
      destination: 'MasonryFlashListLab'
    },
    {
      id: 'lab-svg-anim',
      name: 'SVG Path 动画',
      destination: 'SvgPathAnimationLab'
    },
    {
      id: 'lab-pager',
      name: 'Pager View 引导页',
      destination: 'PagerViewLab'
    },
    {
      id: '0',
      name: '手动手势',
      destination: 'ManualGestures'
    },
    {
      id: '1',
      name: '网格拖拽排序',
      destination: 'DraggableSortingGrid'
    },
    {
      id: '2',
      name: 'Shared Bounds 过渡示例',
      destination: 'SharedBoundsList'
    },
    {
      id: '3',
      name: 'Image Control Actions',
      destination: 'ImageControlActions'
    },
    {
      id: 'task-1',
      name: 'Tinder 卡片滑动 (Deck Swiper)',
      destination: 'TinderSwipe'
    },
    {
      id: 'task-2',
      name: '视差滚动主页 (Parallax)',
      destination: 'ParallaxProfile'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="p-4">
        {pageList.map((page) => (
          <Pressable
            key={page.id}
            onPress={() => navigation.navigate('PlaygroundEntryStack', {
              screen: page.destination
            })}
            className="bg-blue-500 rounded-lg p-4 m-2 shadow-md items-center mb-4"
          >
            <Text className="text-white font-bold text-lg">{page.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
