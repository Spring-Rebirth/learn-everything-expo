import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";
import { PlaygroundEntryStackParamList } from "../../navigation/PlaygroundEntryStack";
import { SharedTransitionStackParamList } from "../../navigation/SharedTransitionStack";
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeContext } from "../../providers/ThemeProvider";

type PageItem = {
  id: string;
  name: string;
  destination: keyof PlaygroundEntryStackParamList;
  params?: PlaygroundEntryStackParamList[keyof PlaygroundEntryStackParamList];
  icon?: string;
  color?: string;
};

export default function Playground() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  const pageList: PageItem[] = [
    {
      id: 'lab-notif',
      name: 'Notifications',
      destination: 'NotificationsLab',
      icon: 'bell',
      color: '#f59e0b'
    },
    {
      id: 'lab-camera',
      name: 'Camera',
      destination: 'CameraLab',
      icon: 'camera',
      color: '#3b82f6'
    },
    {
      id: 'lab-bottom-sheet',
      name: 'Bottom Sheet',
      destination: 'BottomSheetLab',
      icon: 'sheet-plastic',
      color: '#8b5cf6'
    },
    {
      id: 'lab-masonry',
      name: 'Masonry List',
      destination: 'MasonryFlashListLab',
      icon: 'table-cells-large',
      color: '#ec4899'
    },
    {
      id: 'lab-svg-anim',
      name: 'SVG Animation',
      destination: 'SvgPathAnimationLab',
      icon: 'bezier-curve',
      color: '#10b981'
    },
    {
      id: 'lab-pager',
      name: 'Pager View',
      destination: 'PagerViewLab',
      icon: 'pager',
      color: '#6366f1'
    },
    {
      id: 'lab-skeleton',
      name: 'Skeleton Loading',
      destination: 'SkeletonLab',
      icon: 'bone',
      color: '#64748b'
    },
    {
      id: '0',
      name: 'Manual Gestures',
      destination: 'ManualGestures',
      icon: 'hand-pointer',
      color: '#f43f5e'
    },
    {
      id: '1',
      name: 'Sortable Grid',
      destination: 'DraggableSortingGrid',
      icon: 'grip',
      color: '#14b8a6'
    },
    {
      id: '2',
      name: 'Shared Transition',
      destination: 'SharedTransitionStack',
      params: {
        screen: 'SharedTransitionList',
      },
      icon: 'maximize',
      color: '#06b6d4'
    },
    {
      id: 'task-1',
      name: 'Deck Swiper',
      destination: 'TinderSwipe',
      icon: 'layer-group',
      color: '#e11d48'
    },
    {
      id: 'task-2',
      name: 'Parallax Scroll',
      destination: 'ParallaxProfile',
      icon: 'up-down',
      color: '#a855f7'
    },
    {
      id: 'task-3',
      name: 'Interpolation Lab',
      destination: 'InterpolateLab',
      icon: 'sliders',
      color: '#f97316'
    }
  ];

  // Theme Constants
  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const borderClass = isDark ? 'border-slate-800' : 'border-slate-200';
  const iconContainerBg = (color: string) => isDark ? color + '20' : color + '15';

  return (
    <View className={`flex-1 ${bgClass}`}>
      {/* Header with Blur */}
      <View
        className="absolute w-full z-10 overflow-hidden"
        style={{ paddingBottom: 20 }}
      >
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          className="px-6 flex-row justify-between items-center"
          style={{ paddingTop: insets.top + 20 }}
        >
          <Text className={`text-2xl font-bold ${textClass}`}>Playground</Text>
          <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <FontAwesome6 name="flask" size={14} color={isDark ? '#cbd5e1' : '#475569'} />
          </View>
        </View>
        <View className={`absolute bottom-0 w-full h-[1px] ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 100,
          paddingBottom: 100,
          paddingHorizontal: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {pageList.map((page) => (
            <Pressable
              key={page.id}
              onPress={() => navigation.navigate('PlaygroundEntryStack', {
                screen: page.destination,
                ...(page.params ? { params: page.params } : {}),
              })}
              className={`w-[48%] mb-4 p-4 rounded-2xl ${cardBgClass} border ${borderClass} items-center justify-center`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.05,
                shadowRadius: 4,
                elevation: isDark ? 0 : 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: iconContainerBg(page.color || '#64748b') }}
              >
                <FontAwesome6 name={page.icon || 'circle'} size={20} color={page.color || '#64748b'} solid />
              </View>
              <Text className={`font-semibold text-center ${textClass} text-sm`}>{page.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
