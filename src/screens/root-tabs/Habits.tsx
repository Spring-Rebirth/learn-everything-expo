import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useHabitsStore } from '../../store/useHabitsStore';

type EditHabitState = {
  id?: string;
  name: string;
  description: string;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeContext();

  // 注意：Zustand selector 里不要直接做 filter/map 这种返回新引用的操作，
  // 否则在严格模式下会触发 “getSnapshot should be cached” 警告并可能导致无限循环。
  // 这里先取出原始数组，再在组件中用 useMemo 派生出未归档列表。
  const habitsAll = useHabitsStore((s) => s.habits);
  const records = useHabitsStore((s) => s.records);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const toggleHabitForDate = useHabitsStore((s) => s.toggleHabitForDate);
  const getStreak = useHabitsStore((s) => s.getStreak);
  const getWeeklyStats = useHabitsStore((s) => s.getWeeklyStats);

  const [editing, setEditing] = useState<EditHabitState | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const today = todayKey();

  const habits = useMemo(
    () => habitsAll.filter((h) => !h.archived),
    [habitsAll],
  );

  const todayDoneMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    records.forEach((r) => {
      if (r.date === today && r.done) {
        map[r.habitId] = true;
      }
    });
    return map;
  }, [records, today]);

  const openNewModal = () => {
    setEditing({
      name: '',
      description: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (habit: { id: string; name: string; description?: string }) => {
    setEditing({
      id: habit.id,
      name: habit.name,
      description: habit.description ?? '',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditing(null);
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) {
      return;
    }
    const base = {
      name: editing.name.trim(),
      description: editing.description.trim() || undefined,
    };
    if (editing.id) {
      updateHabit(editing.id, base);
    } else {
      addHabit({
        ...base,
        color: '#22c55e',
        icon: 'leaf',
        remoteId: null,
        syncStatus: 'local-only',
      });
    }
    closeModal();
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => todayDoneMap[h.id]).length;
  const progress = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const bgClass = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
  const textClass = isDark ? 'text-slate-50' : 'text-slate-900';
  const secondaryTextClass = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <View className={`flex-1 ${bgClass}`}>
      {/* Header */}
      <View
        className="px-6 pb-4 pt-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text className={`text-xs font-medium ${secondaryTextClass}`}>
          今天 {today}
        </Text>
        <Text className={`text-2xl font-bold mt-1 ${textClass}`}>
          习惯打卡
        </Text>
        <Text className={`mt-2 text-sm ${secondaryTextClass}`}>
          已完成 {completedToday} / {totalHabits} 个习惯
        </Text>

        {/* Progress bar */}
        <View className="mt-4">
          <View className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <View
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className={`mt-1 text-xs ${secondaryTextClass}`}>今日进度 {progress}%</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-16">
            <Text className={`text-base ${secondaryTextClass}`}>
              先创建一个想坚持的习惯吧，例如「早睡 23:00」～
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const doneToday = !!todayDoneMap[item.id];
          const streak = getStreak(item.id);
          const weekly = getWeeklyStats(item.id);
          return (
            <Pressable
              onPress={() => openEditModal(item)}
              className={`flex-row items-center mb-3 px-4 py-3 rounded-2xl ${cardBgClass} ${
                isDark ? 'border border-slate-700' : 'border border-slate-200'
              }`}
            >
              <Pressable
                onPress={() => toggleHabitForDate(item.id, today)}
                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  doneToday ? 'bg-emerald-500' : 'border border-slate-300'
                }`}
              >
                {doneToday && (
                  <FontAwesome6 name="check" size={16} color="#FFFFFF" />
                )}
              </Pressable>
              <View className="flex-1">
                <Text className={`text-sm font-semibold ${textClass}`}>
                  {item.name}
                </Text>
                {item.description ? (
                  <Text className={`text-xs mt-1 ${secondaryTextClass}`}>
                    {item.description}
                  </Text>
                ) : null}
                <View className="flex-row mt-1 space-x-3">
                  <Text className={`text-[11px] ${secondaryTextClass}`}>
                    连续 {streak} 天
                  </Text>
                  <Text className={`text-[11px] ${secondaryTextClass}`}>
                    近 7 天完成 {weekly} 次
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Floating add button */}
      <Pressable
        onPress={openNewModal}
        className="absolute right-6 rounded-full items-center justify-center bg-emerald-500"
        style={{
          bottom: insets.bottom + 24,
          width: 56,
          height: 56,
        }}
      >
        <FontAwesome6 name="plus" size={20} color="#FFFFFF" />
      </Pressable>

      {/* Edit / New Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable
            className="flex-1 bg-black/30"
            onPress={closeModal}
          />
          <View
            className={`rounded-t-3xl px-5 pt-4 pb-6 ${cardBgClass}`}
          >
            <Text className={`text-base font-semibold mb-4 ${textClass}`}>
              {editing?.id ? '编辑习惯' : '新建习惯'}
            </Text>
            <View className="mb-3">
              <Text className={`text-xs mb-1 ${secondaryTextClass}`}>习惯名称</Text>
              <TextInput
                value={editing?.name ?? ''}
                onChangeText={(text) =>
                  setEditing((prev) =>
                    prev ? { ...prev, name: text } : prev,
                  )
                }
                placeholder="例如：早起 7:00，阅读 30 分钟"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`rounded-2xl px-3 py-2 text-sm border ${
                  isDark ? 'border-slate-700 text-slate-50' : 'border-slate-200 text-slate-900'
                }`}
              />
            </View>
            <View className="mb-4">
              <Text className={`text-xs mb-1 ${secondaryTextClass}`}>说明（可选）</Text>
              <TextInput
                value={editing?.description ?? ''}
                onChangeText={(text) =>
                  setEditing((prev) =>
                    prev ? { ...prev, description: text } : prev,
                  )
                }
                placeholder="为自己写一句小小的鼓励"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`rounded-2xl px-3 py-2 text-sm border ${
                  isDark ? 'border-slate-700 text-slate-50' : 'border-slate-200 text-slate-900'
                }`}
                multiline
              />
            </View>
            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={closeModal}
                className="px-4 py-2 rounded-full bg-slate-200"
              >
                <Text className="text-sm text-slate-700">取消</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                className="px-5 py-2 rounded-full bg-emerald-500"
              >
                <Text className="text-sm text-white font-semibold">保存</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}



