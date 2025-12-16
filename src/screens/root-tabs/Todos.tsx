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
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useTodosStore, type Todo, type TodoPriority } from '../../store/useTodosStore';

type EditState = {
  id?: string;
  title: string;
  description: string;
  priority: TodoPriority;
};

export default function TodosScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeContext();

  const todos = useTodosStore((s) => s.todos);
  const filters = useTodosStore((s) => s.filters);
  const addTodo = useTodosStore((s) => s.addTodo);
  const updateTodo = useTodosStore((s) => s.updateTodo);
  const toggleTodo = useTodosStore((s) => s.toggleTodo);
  const removeTodo = useTodosStore((s) => s.removeTodo);
  const clearCompleted = useTodosStore((s) => s.clearCompleted);
  const setFilters = useTodosStore((s) => s.setFilters);

  const [editing, setEditing] = useState<EditState | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const filteredTodos = useMemo(() => {
    return todos
      .filter((t) => (filters.showCompleted ? true : !t.completed))
      .filter((t) =>
        filters.searchText
          ? t.title.toLowerCase().includes(filters.searchText.toLowerCase())
          : true,
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [todos, filters]);

  const openNewModal = () => {
    setEditing({
      title: '',
      description: '',
      priority: 'medium',
    });
    setModalVisible(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditing({
      id: todo.id,
      title: todo.title,
      description: todo.description ?? '',
      priority: todo.priority ?? 'medium',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditing(null);
  };

  const handleSave = () => {
    if (!editing || !editing.title.trim()) {
      return;
    }
    const base = {
      title: editing.title.trim(),
      description: editing.description.trim() || undefined,
      priority: editing.priority,
    };
    if (editing.id) {
      updateTodo(editing.id, base);
    } else {
      addTodo({
        ...base,
        completed: false,
      });
    }
    closeModal();
  };

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
          今天
        </Text>
        <Text className={`text-2xl font-bold mt-1 ${textClass}`}>
          待办清单
        </Text>
        <Text className={`mt-2 text-sm ${secondaryTextClass}`}>
          还有 {pendingCount} 个任务未完成，已完成 {completedCount} 个
        </Text>

        {/* Filter & Search */}
        <View className="flex-row items-center mt-4 space-x-3">
          <Pressable
            onPress={() => setFilters({ showCompleted: !filters.showCompleted })}
            className={`px-3 py-2 rounded-full border ${
              filters.showCompleted
                ? 'border-pink-400 bg-pink-50/80'
                : isDark
                ? 'border-slate-700'
                : 'border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                filters.showCompleted ? 'text-pink-600' : secondaryTextClass
              }`}
            >
              {filters.showCompleted ? '显示全部' : '隐藏已完成'}
            </Text>
          </Pressable>

          <View
            className={`flex-1 flex-row items-center px-3 py-2 rounded-full ${cardBgClass} ${
              isDark ? 'border border-slate-700' : 'border border-slate-200'
            }`}
          >
            <FontAwesome6
              name="magnifying-glass"
              size={14}
              color={isDark ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder="搜索待办..."
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={filters.searchText}
              onChangeText={(text) => setFilters({ searchText: text })}
              className={`ml-2 flex-1 text-sm ${textClass}`}
            />
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-16">
            <Text className={`text-base ${secondaryTextClass}`}>
              还没有任务，点击右下角按钮新建一个吧～
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openEditModal(item)}
            className={`flex-row items-center mb-3 px-4 py-3 rounded-2xl ${cardBgClass} ${
              isDark ? 'border border-slate-700' : 'border border-slate-200'
            }`}
          >
            <Pressable
              onPress={() => toggleTodo(item.id)}
              className={`w-7 h-7 rounded-full items-center justify-center mr-3 ${
                item.completed ? 'bg-emerald-500' : 'border border-slate-300'
              }`}
            >
              {item.completed && (
                <FontAwesome6 name="check" size={14} color="#FFFFFF" />
              )}
            </Pressable>
            <View className="flex-1">
              <Text
                className={`text-sm font-semibold ${textClass} ${
                  item.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {item.title}
              </Text>
              {item.description ? (
                <Text className={`text-xs mt-1 ${secondaryTextClass}`}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => removeTodo(item.id)}
              hitSlop={8}
              className="ml-3"
            >
              <FontAwesome6
                name="trash-can"
                size={14}
                color={isDark ? '#6b7280' : '#9ca3af'}
              />
            </Pressable>
          </Pressable>
        )}
      />

      {/* Clear completed */}
      {completedCount > 0 && (
        <Pressable
          onPress={clearCompleted}
          className="absolute left-4 right-4 bottom-24 items-center justify-center py-2 rounded-full bg-slate-900/90"
          style={{ bottom: insets.bottom + 72 }}
        >
          <Text className="text-xs text-slate-100">
            清除已完成（{completedCount}）
          </Text>
        </Pressable>
      )}

      {/* Floating add button */}
      <Pressable
        onPress={openNewModal}
        className="absolute right-6 rounded-full items-center justify-center bg-pink-500"
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
              {editing?.id ? '编辑待办' : '新建待办'}
            </Text>
            <View className="mb-3">
              <Text className={`text-xs mb-1 ${secondaryTextClass}`}>标题</Text>
              <TextInput
                value={editing?.title ?? ''}
                onChangeText={(text) =>
                  setEditing((prev) =>
                    prev ? { ...prev, title: text } : prev,
                  )
                }
                placeholder="今天最重要的一件事是..."
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                className={`rounded-2xl px-3 py-2 text-sm border ${
                  isDark ? 'border-slate-700 text-slate-50' : 'border-slate-200 text-slate-900'
                }`}
              />
            </View>
            <View className="mb-4">
              <Text className={`text-xs mb-1 ${secondaryTextClass}`}>备注</Text>
              <TextInput
                value={editing?.description ?? ''}
                onChangeText={(text) =>
                  setEditing((prev) =>
                    prev ? { ...prev, description: text } : prev,
                  )
                }
                placeholder="可选，补充一些细节"
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
                className="px-5 py-2 rounded-full bg-pink-500"
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



