import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, Post } from '../../services/api';
import { useThemeContext } from '../../providers/ThemeProvider';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { FontAwesome6 } from '@expo/vector-icons';

export default function Notice() {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
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

  // Theme Constants
  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const secondaryTextClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const borderClass = isDark ? 'border-slate-800' : 'border-slate-200';
  const iconColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 : slate-500

  const noticeLink = Linking.createURL('/tabs/notice');
  const notificationsLink = Linking.createURL('/lab/notifications');
  const bottomSheetLink = Linking.createURL('/lab/bottom-sheet');

  if (isPending) {
    return (
      <View className={`flex-1 items-center justify-center ${bgClass}`}>
        <ActivityIndicator size="large" color={isDark ? '#38bdf8' : '#0ea5e9'} />
        <Text className={`mt-4 font-semibold ${textClass}`}>
          Loading...
        </Text>
      </View>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Request Failed';
    return (
      <View className={`flex-1 items-center justify-center px-6 ${bgClass}`}>
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <FontAwesome6 name="triangle-exclamation" size={32} color={isDark ? '#ef4444' : '#dc2626'} />
        </View>
        <Text className={`text-xl mb-2 font-bold ${textClass}`}>
          Oops! Something went wrong
        </Text>
        <Text className={`mb-8 text-center ${secondaryTextClass}`}>
          {errorMessage}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className={`px-6 py-3 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'} active:opacity-80`}
        >
          <Text className="font-semibold text-white">Try Again</Text>
        </Pressable>
      </View>
    );
  }

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
            <Text className={`text-2xl font-bold ${textClass}`}>Notifications</Text>
            <View className={`px-2 py-1 rounded-md ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <Text className={`text-xs font-medium ${secondaryTextClass}`}>
                    {posts.length} New
                </Text>
            </View>
        </View>
        <View className={`absolute bottom-0 w-full h-[1px] ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={isDark ? '#fff' : '#000'} />}
        contentContainerStyle={{ 
            paddingTop: insets.top + 100,
            paddingBottom: 100, 
            paddingHorizontal: 20 
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="mb-6">
            <View className={`p-4 rounded-2xl mb-6 ${cardBgClass} border ${borderClass}`}>
                <View className="flex-row items-center mb-3">
                    <FontAwesome6 name="link" size={14} color={isDark ? '#60a5fa' : '#3b82f6'} />
                    <Text className={`ml-2 font-semibold ${textClass}`}>Quick Links</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {[
                        { label: 'Deep Link', action: () => Linking.openURL(noticeLink) },
                        { label: 'Notif Lab', action: () => Linking.openURL(notificationsLink) },
                        { label: 'Bottom Sheet', action: () => Linking.openURL(bottomSheetLink) }
                    ].map((link, i) => (
                        <Pressable
                            key={i}
                            onPress={link.action}
                            className={`px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'} active:opacity-70`}
                        >
                            <Text className={`text-xs font-medium ${textClass}`}>{link.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            
            <View className="flex-row justify-between items-center mb-2">
                 <Text className={`text-sm font-bold uppercase tracking-wider ${secondaryTextClass}`}>
                  Latest Updates
                </Text>
                <Text className={`text-xs ${secondaryTextClass}`}>
                  Updated: {lastUpdated}
                </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View
            className={`rounded-2xl p-5 mb-4 ${cardBgClass} border ${borderClass}`}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.05,
                shadowRadius: 8,
                elevation: isDark ? 0 : 2,
            }}
          >
            <View className="flex-row justify-between items-start mb-2">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <FontAwesome6 name="bell" size={14} color={isDark ? '#60a5fa' : '#3b82f6'} solid />
                </View>
                <View className="flex-1">
                     <Text className={`text-base font-bold mb-1 leading-6 ${textClass}`}>
                      {item.title}
                    </Text>
                    <Text className={`text-sm leading-5 ${secondaryTextClass}`} numberOfLines={3}>
                      {item.body}
                    </Text>
                </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
