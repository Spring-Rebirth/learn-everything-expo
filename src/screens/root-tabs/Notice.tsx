import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, Post } from '../../services/api';
import { useThemeContext } from '../../providers/ThemeProvider';
import * as Linking from 'expo-linking';

export default function Notice() {
  const { isDark } = useThemeContext();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(12),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';
  const posts = data ?? [];
  const textColor = isDark ? '#e5e7eb' : '#0f172a';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const border = isDark ? '#1f2937' : '#e2e8f0';
  const noticeLink = Linking.createURL('/tabs/notice');
  const notificationsLink = Linking.createURL('/lab/notifications');
  const bottomSheetLink = Linking.createURL('/lab/bottom-sheet');

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
        <ActivityIndicator size="large" color={isDark ? '#38bdf8' : '#0ea5e9'} />
        <Text className="mt-4 font-semibold" style={{ color: textColor }}>
          加载中（已开启缓存）
        </Text>
      </View>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : '请求失败';
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
        <Text className="text-lg mb-3 font-semibold" style={{ color: textColor }}>
          获取通知列表失败
        </Text>
        <Text className="mb-6 text-center" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
          {errorMessage}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="px-4 py-3 rounded-full"
          style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
        >
          <Text className="font-semibold text-white">重试</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={textColor} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={() => (
          <View className="mb-4">
            <Text className="text-xl font-bold mb-1" style={{ color: textColor }}>
              公告（React Query 缓存 5 分钟）
            </Text>
            <Text style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
              下拉刷新 | 最近更新：{lastUpdated}
            </Text>
            <View className="mt-3">
              <Text className="font-semibold mb-2" style={{ color: textColor }}>
                深链示例
              </Text>
              <View className="flex-row">
                <Pressable
                  onPress={() => Linking.openURL(noticeLink)}
                  className="px-3 py-2 rounded-xl mr-2"
                  style={{ backgroundColor: isDark ? '#1f2937' : '#e2e8f0' }}
                >
                  <Text style={{ color: textColor }}>打开 Notice</Text>
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL(notificationsLink)}
                  className="px-3 py-2 rounded-xl mr-2"
                  style={{ backgroundColor: isDark ? '#0f766e' : '#10b981' }}
                >
                  <Text className="text-white font-semibold">通知实验</Text>
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL(bottomSheetLink)}
                  className="px-3 py-2 rounded-xl"
                  style={{ backgroundColor: isDark ? '#1d4ed8' : '#2563eb' }}
                >
                  <Text className="text-white font-semibold">Bottom Sheet</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            className="rounded-2xl p-4 mb-3"
            style={{
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: border,
              shadowColor: isDark ? '#0f172a' : '#000',
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: textColor }}>
              {item.title}
            </Text>
            <Text style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
              {item.body}
            </Text>
          </View>
        )}
      />
    </View>
  );
}