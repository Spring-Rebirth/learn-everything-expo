import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Habit = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  archived: boolean;
  createdAt: string;
  // 预留未来云同步字段
  remoteId?: string | null;
  syncStatus?: 'local-only' | 'pending-sync' | 'synced';
};

export type HabitRecord = {
  habitId: string;
  date: string; // YYYY-MM-DD
  done: boolean;
};

type HabitsState = {
  hydrated: boolean;
  habits: Habit[];
  records: HabitRecord[];
  addHabit: (input: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  updateHabit: (id: string, patch: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  archiveHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, date: string) => void;
  getStreak: (habitId: string) => number;
  getWeeklyStats: (habitId: string) => number;
  setHydrated: (value: boolean) => void;
};

const generateId = () => Math.random().toString(36).slice(2);

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      habits: [],
      records: [],
      addHabit: (input) => {
        const now = new Date().toISOString();
        const habit: Habit = {
          id: generateId(),
          archived: false,
          syncStatus: 'local-only',
          ...input,
          createdAt: now,
        };
        set((state) => ({
          habits: [habit, ...state.habits],
        }));
      },
      updateHabit: (id, patch) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  ...patch,
                  syncStatus: habit.syncStatus ?? 'local-only',
                }
              : habit,
          ),
        }));
      },
      archiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  archived: true,
                  syncStatus: habit.syncStatus ?? 'local-only',
                }
              : habit,
          ),
        }));
      },
      toggleHabitForDate: (habitId, date) => {
        set((state) => {
          const key = date || toDateKey(new Date());
          const existingIndex = state.records.findIndex(
            (r) => r.habitId === habitId && r.date === key,
          );
          if (existingIndex === -1) {
            return {
              records: [
                ...state.records,
                { habitId, date: key, done: true },
              ],
            };
          }
          const next = [...state.records];
          const current = next[existingIndex];
          // 切换 done 状态，如果变回 false，可以直接移除记录，保持干净
          if (current.done) {
            next.splice(existingIndex, 1);
          } else {
            next[existingIndex] = { ...current, done: true };
          }
          return { records: next };
        });
      },
      getStreak: (habitId) => {
        const { records } = get();
        const byDate = new Set(
          records
            .filter((r) => r.habitId === habitId && r.done)
            .map((r) => r.date),
        );
        let streak = 0;
        let current = new Date();
        while (true) {
          const key = toDateKey(current);
          if (byDate.has(key)) {
            streak += 1;
            current.setDate(current.getDate() - 1);
          } else {
            break;
          }
        }
        return streak;
      },
      getWeeklyStats: (habitId) => {
        const { records } = get();
        const today = new Date();
        const start = new Date();
        start.setDate(today.getDate() - 6);
        const startKey = toDateKey(start);
        return records.filter(
          (r) =>
            r.habitId === habitId &&
            r.done &&
            r.date >= startKey &&
            r.date <= toDateKey(today),
        ).length;
      },
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'habits-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        habits: state.habits,
        records: state.records,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);


