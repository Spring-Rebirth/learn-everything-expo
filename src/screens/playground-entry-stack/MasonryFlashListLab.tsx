import { View, Text, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
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

  // TODO: 生成模拟数据
  const data: Item[] = useMemo(() => [], []);

  const renderItem = ({ item }: { item: Item }) => {
    // TODO: 实现列表项渲染逻辑
    return (
      <View
        style={{
          height: item.height,
          backgroundColor: item.color,
          margin: 4,
          borderRadius: 8
        }}
        className="justify-center items-center"
      >
        <Text className="text-white font-bold">{item.title}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View className="p-4">
        <Text className="text-xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
          Masonry Layout with FlashList
        </Text>
        <Text className="text-sm mb-4" style={{ color: isDark ? '#ccc' : '#666' }}>
          高性能瀑布流列表，适合图片墙或卡片布局。
        </Text>
      </View>

      <View className="flex-1 w-full">
        <FlashList
          data={data}
          renderItem={renderItem}
          numColumns={2}
          {...({ estimatedItemSize: 200 } as any)}
        />
      </View>
    </View>
  );
}

