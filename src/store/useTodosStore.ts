import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  priority?: TodoPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  // 预留未来云同步字段
  remoteId?: string | null;
  syncStatus?: 'local-only' | 'pending-sync' | 'synced';
};

export type TodoFilterState = {
  showCompleted: boolean;
  searchText: string;
};

type TodosState = {
  hydrated: boolean;
  todos: Todo[];
  filters: TodoFilterState;
  addTodo: (input: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilters: (filters: Partial<TodoFilterState>) => void;
  setHydrated: (value: boolean) => void;
};

const generateId = () => Math.random().toString(36).slice(2);

export const useTodosStore = create<TodosState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      todos: [],
      filters: {
        showCompleted: true,
        searchText: '',
      },
      addTodo: (input) => {
        const now = new Date().toISOString();
        const next: Todo = {
          id: generateId(),
          completed: false,
          syncStatus: 'local-only',
          ...input,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          todos: [next, ...state.todos],
        }));
      },
      updateTodo: (id, patch) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                  syncStatus: todo.syncStatus ?? 'local-only',
                }
              : todo,
          ),
        }));
      },
      toggleTodo: (id) => {
        const { todos } = get();
        const target = todos.find((t) => t.id === id);
        if (!target) return;
        const nextCompleted = !target.completed;
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: nextCompleted,
                  updatedAt: new Date().toISOString(),
                  syncStatus: todo.syncStatus ?? 'local-only',
                }
              : todo,
          ),
        }));
      },
      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },
      setFilters: (filters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        }));
      },
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'todos-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        todos: state.todos,
        filters: state.filters,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);


