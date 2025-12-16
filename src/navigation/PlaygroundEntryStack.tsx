import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TinderSwipe from "../screens/playground-entry-stack/TinderSwipe";
import ParallaxProfile from "../screens/playground-entry-stack/ParallaxProfile";
import ManualGestures from "../screens/playground-entry-stack/ManualGestures";
import DraggableSortingGrid from "../screens/playground-entry-stack/DraggableSortingGrid";
import NotificationsLab from "../screens/playground-entry-stack/NotificationsLab";
import CameraLab from "../screens/playground-entry-stack/CameraLab";
import BottomSheetLab from "../screens/playground-entry-stack/BottomSheetLab";
import MasonryFlashListLab from "../screens/playground-entry-stack/MasonryFlashListLab";
import SvgPathAnimationLab from "../screens/playground-entry-stack/SvgPathAnimationLab";
import PagerViewLab from "../screens/playground-entry-stack/PagerViewLab";
import SkeletonLab from "../screens/playground-entry-stack/SkeletonLab";
import InterpolateLab from "../screens/playground-entry-stack/InterpolateLab";
import { BackButton } from "../components/playground/BackButton";
import SharedTransitionStack, { SharedTransitionStackParamList } from "./SharedTransitionStack";

export type PlaygroundEntryStackParamList = {
  ManualGestures: undefined;
  DraggableSortingGrid: undefined;
  SharedTransitionStack: {
    screen: keyof SharedTransitionStackParamList;
  };
  TinderSwipe: undefined;
  ParallaxProfile: undefined;
  NotificationsLab: undefined;
  CameraLab: undefined;
  BottomSheetLab: undefined;
  MasonryFlashListLab: undefined;
  SvgPathAnimationLab: undefined;
  PagerViewLab: undefined;
  SkeletonLab: undefined;
  InterpolateLab: undefined;
};

const Stack = createNativeStackNavigator<PlaygroundEntryStackParamList>();

export default function PlaygroundEntryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationsLab"
        component={NotificationsLab}
        options={({ navigation }) => ({
          headerTitle: '通知实验室',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="CameraLab"
        component={CameraLab}
        options={({ navigation }) => ({
          headerTitle: '相机实验室',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="BottomSheetLab"
        component={BottomSheetLab}
        options={({ navigation }) => ({
          headerTitle: '可拖拽 BottomSheet',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="MasonryFlashListLab"
        component={MasonryFlashListLab}
        options={({ navigation }) => ({
          headerTitle: 'Masonry FlashList',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="SvgPathAnimationLab"
        component={SvgPathAnimationLab}
        options={({ navigation }) => ({
          headerTitle: 'SVG Path Animation',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="PagerViewLab"
        component={PagerViewLab}
        options={({ navigation }) => ({
          headerTitle: 'Pager View',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="SkeletonLab"
        component={SkeletonLab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ManualGestures"
        component={ManualGestures}
        options={({ navigation }) => ({
          headerTitle: 'Manual Gestures',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="DraggableSortingGrid"
        component={DraggableSortingGrid}
        options={({ navigation }) => ({
          headerTitle: 'Draggable Grid',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="SharedTransitionStack"
        component={SharedTransitionStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TinderSwipe"
        component={TinderSwipe}
        options={({ navigation }) => ({
          headerTitle: 'Tinder Swipe',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ParallaxProfile"
        component={ParallaxProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InterpolateLab"
        component={InterpolateLab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
