import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function PagerViewLab() {
  const { isDark } = useThemeContext();

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <View className="p-4 items-center">
        <Text className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
          Pager View Onboarding
        </Text>
        <Text className="text-sm" style={{ color: isDark ? '#ccc' : '#666' }}>
          左右滑动的引导页示例
        </Text>
      </View>

      <PagerView style={styles.pagerView} initialPage={0}>
        <View key="1" className="justify-center items-center p-8">
          <View className="w-64 h-64 bg-blue-100 rounded-full mb-8 items-center justify-center">
             <Text className="text-6xl">🚀</Text>
          </View>
          <Text className="text-2xl font-bold mb-4 dark:text-white">Welcome</Text>
          <Text className="text-center text-gray-500 dark:text-gray-400">
            Swipe right to see more features.
          </Text>
        </View>
        
        <View key="2" className="justify-center items-center p-8">
          <View className="w-64 h-64 bg-purple-100 rounded-full mb-8 items-center justify-center">
             <Text className="text-6xl">🎨</Text>
          </View>
          <Text className="text-2xl font-bold mb-4 dark:text-white">Design</Text>
          <Text className="text-center text-gray-500 dark:text-gray-400">
            Beautiful animations and interactions.
          </Text>
        </View>
        
        <View key="3" className="justify-center items-center p-8">
          <View className="w-64 h-64 bg-green-100 rounded-full mb-8 items-center justify-center">
             <Text className="text-6xl">⚡️</Text>
          </View>
          <Text className="text-2xl font-bold mb-4 dark:text-white">Fast</Text>
          <Text className="text-center text-gray-500 dark:text-gray-400">
            Built for performance.
          </Text>
        </View>
      </PagerView>

      {/* TODO: Add Pagination Dots Indicator */}
      <View className="h-12 justify-center items-center">
         <Text style={{ color: isDark ? '#666' : '#999' }}>... Dots Indicator ...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

