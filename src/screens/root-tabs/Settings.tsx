import React from 'react';
import { View, Text } from 'react-native';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function SettingsScreen() {
  const { isDark } = useThemeContext();

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Text className={`text-xl font-semibold ${isDark ? 'text-slate-50' : 'text-slate-800'}`}>
        设置（建设中）
      </Text>
    </View>
  );
}


