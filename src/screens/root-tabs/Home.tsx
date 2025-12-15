import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeContext } from '../../providers/ThemeProvider';
import { imageAssets } from '../../constant/imageAssets';

export default function Home() {
  const { isDark, toggleTheme } = useThemeContext();
  const insets = useSafeAreaInsets();

  // Theme Classes
  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const secondaryTextClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const iconContainerBg = (color: string) => isDark ? color + '30' : color + '20'; // Helper for icon bg opacity
  const borderClass = isDark ? 'border-slate-800' : 'border-slate-200';

  return (
    <View className={`flex-1 ${bgClass}`}>
      {/* Header */}
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
          <View>
            <Text className={`text-sm font-medium ${secondaryTextClass} mb-1`}>Welcome Back 👋</Text>
            <Text className={`text-2xl font-bold ${textClass}`}>Explorer</Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'} shadow-sm`}
          >
            <FontAwesome6 name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#fbbf24" : "#64748b"} solid />
          </Pressable>
        </View>
        {/* Subtle border */}
        <View className={`absolute bottom-0 w-full h-[1px] ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'}`} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 110,
          paddingBottom: 100,
          paddingHorizontal: 24
        }}
      >
        {/* Hero Card */}
        <View className="w-full h-48 rounded-[24px] overflow-hidden mb-8 shadow-sm bg-gray-200 relative">
          <Image
            source={imageAssets.nature1}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
          <View className="w-full h-full bg-black/30 absolute p-6 justify-end">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full backdrop-blur-md mb-2">
              <Text className="text-white text-xs font-bold uppercase tracking-wider">Featured</Text>
            </View>
            <Text className="text-white text-3xl font-bold">Discover Nature</Text>
            <Text className="text-white/90 text-base mt-1">Find peace in the wild.</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className={`text-lg font-bold ${textClass}`}>Quick Actions</Text>
          <Text className={`text-xs font-medium ${secondaryTextClass}`}>View All</Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-8">
          {[
            { icon: 'compass', label: 'Explore', color: '#6366f1' },
            { icon: 'heart', label: 'Favorites', color: '#ef4444' },
            { icon: 'bell', label: 'Messages', color: '#f59e0b' },
            { icon: 'gear', label: 'Settings', color: '#64748b' },
          ].map((item, index) => (
            <Pressable
              key={index}
              className={`w-[48%] ${cardBgClass} p-5 rounded-2xl mb-4 items-center justify-center shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: iconContainerBg(item.color) }}
              >
                <FontAwesome6 name={item.icon} size={22} color={item.color} solid />
              </View>
              <Text className={`font-semibold ${textClass}`}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recent Section */}
        <Text className={`text-lg font-bold mb-4 ${textClass}`}>Recent Activity</Text>
        <View className={`w-full ${cardBgClass} rounded-2xl p-2 shadow-sm border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
          {[
            { title: 'Registration Completed', time: 'Just now', icon: 'check-circle', color: '#10b981' },
            { title: 'New Notification', time: '2 hours ago', icon: 'bell', color: '#3b82f6' },
            { title: 'System Update', time: 'Yesterday', icon: 'rotate', color: '#8b5cf6' }
          ].map((item, index, arr) => (
            <Pressable
              key={index}
              className={`flex-row items-center p-3 ${index !== arr.length - 1
                ? `border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`
                : ''
                }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3`} style={{ backgroundColor: iconContainerBg(item.color) }}>
                <FontAwesome6 name={item.icon} size={16} color={item.color} solid />
              </View>
              <View className="flex-1">
                <Text className={`font-medium ${textClass}`}>{item.title}</Text>
                <Text className={`text-xs ${secondaryTextClass}`}>{item.time}</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={12} color={isDark ? '#475569' : '#cbd5e1'} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
