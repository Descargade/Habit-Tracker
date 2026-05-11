import { useState, useEffect } from 'react';
import { format, isSameDay, subDays, parseISO, max } from 'date-fns';

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  completions: string[];
};

export type AppData = {
  habits: Habit[];
};

const STORAGE_KEY = 'habits-data';

const defaultData: AppData = {
  habits: []
};

function getStorageData(): AppData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.error('Failed to parse habits data', error);
    return defaultData;
  }
}

function setStorageData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save habits data', error);
  }
}

export function useHabits() {
  const [data, setData] = useState<AppData>(getStorageData);

  useEffect(() => {
    setStorageData(data);
  }, [data]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: []
    };
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'completions'>>) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, ...updates } : h)
    }));
  };

  const deleteHabit = (id: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  };

  const toggleCompletion = (id: string, dateStr: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        const isCompleted = h.completions.includes(dateStr);
        return {
          ...h,
          completions: isCompleted 
            ? h.completions.filter(d => d !== dateStr)
            : [...h.completions, dateStr].sort()
        };
      })
    }));
  };

  const reorderHabits = (newOrderIds: string[]) => {
    setData(prev => {
      const newHabits = newOrderIds.map(id => prev.habits.find(h => h.id === id)).filter(Boolean) as Habit[];
      return { ...prev, habits: newHabits };
    });
  };

  return {
    habits: data.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    reorderHabits
  };
}

export function calculateStreaks(completions: string[]) {
  if (completions.length === 0) return { current: 0, longest: 0 };
  
  const dates = completions.map(d => parseISO(d)).sort((a, b) => b.getTime() - a.getTime());
  
  const today = new Date();
  const yesterday = subDays(today, 1);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;
  
  // Calculate longest
  const ascDates = [...dates].reverse();
  ascDates.forEach((date, i) => {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = ascDates[i - 1];
      if (isSameDay(date, prevDate)) {
        // same day, ignore
      } else if (isSameDay(subDays(date, 1), prevDate)) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  });

  // Calculate current
  const latestDate = dates[0];
  if (!isSameDay(latestDate, today) && !isSameDay(latestDate, yesterday)) {
    currentStreak = 0;
  } else {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      if (isSameDay(dates[i], dates[i-1])) continue; // Duplicate
      if (isSameDay(dates[i], subDays(dates[i-1], 1))) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, longest: longestStreak };
}
