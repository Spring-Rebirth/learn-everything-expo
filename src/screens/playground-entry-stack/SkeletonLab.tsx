import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FloatingBackButton } from '../../components/playground/FloatingBackButton';

export default function SkeletonLab() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Floating Back Button */}
      <FloatingBackButton />

      <View className="flex-1 items-center justify-center p-6">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
          <FontAwesome6 name="bone" size={32} color="#94a3b8" />
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-2">Skeleton Loading</Text>
        <Text className="text-base text-gray-500 text-center">
          Learn how to create shimmering placeholder animations using MaskedView and Reanimated.
        </Text>
      </View>
    </View>
  );
}
