import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SharedBoundsList from "../screens/playground-entry-stack/SharedBoundsList";
import SharedBoundsDetail from "../screens/playground-entry-stack/SharedBoundsDetail";
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
import { TouchableOpacity } from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';
import { View } from "react-native";

export type PlaygroundEntryStackParamList = {
  ManualGestures: undefined;
  DraggableSortingGrid: undefined;
  SharedBoundsList: undefined;
  SharedBoundsDetail: { id: string };
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

function BackButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity
      testID='back-button'
      onPress={() => navigation.goBack()}
    >
      <View
        className='w-12 h-12 rounded-full bg-white/90 items-center justify-center'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <FontAwesome6 name='arrow-left' size={20} color='#374151' iconStyle='solid' />
      </View>
    </TouchableOpacity>
  );
}

export default function PlaygroundEntryStack() {
  return (
    <Stack.Navigator initialRouteName="SharedBoundsList">
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
        name="SharedBoundsList"
        component={SharedBoundsList}
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerLeft: () => (
            <BackButton navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="SharedBoundsDetail"
        component={SharedBoundsDetail}
        options={{
          headerShown: false,
          animation: 'none',
        }}
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
