import { View, Text, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useThemeContext } from '../../providers/ThemeProvider';

// 模拟数据类型
type Item = {
  id: string;
  title: string;
  height: number;
  color: string;
};

export default function MasonryFlashListLab() {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  // 生成简单的模拟数据
  const data: Item[] = useMemo(() => {
    return new Array(20).fill(0).map((_, i) => ({
      id: i.toString(),
      title: `${i + 1}`,
      height: Math.floor(Math.random() * 100) + 150, // 随机高度 150-250
      color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]
    }));
  }, []);

  // 将数据分配到两列
  const [leftColumn, rightColumn] = useMemo(() => {
    const left: Item[] = [];
    const right: Item[] = [];
    data.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });
    return [left, right];
  }, [data]);

  const renderItem = (item: Item) => {
    return (
      <View
        key={item.id}
        style={{
          height: item.height,
          backgroundColor: item.color,
          marginBottom: 8,
          borderRadius: 12
        }}
        className="justify-center items-center shadow-sm w-full"
      >
        <Text className="text-white font-bold text-2xl">{item.title}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View className="p-4">
        <Text className="text-xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
          Masonry Layout (Manual)
        </Text>
        <Text className="text-sm mb-4" style={{ color: isDark ? '#ccc' : '#666' }}>
          手动实现的瀑布流布局（使用 ScrollView + 两列 View）。
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row">
          {/* 左列 */}
          <View className="flex-1 mr-2">
            {leftColumn.map(renderItem)}
          </View>
          {/* 右列 */}
          <View className="flex-1 ml-2">
            {rightColumn.map(renderItem)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

