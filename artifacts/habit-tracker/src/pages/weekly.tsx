import { useState } from "react";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { useHabits, calculateStreaks } from "@/hooks/use-habits";
import { Check } from "lucide-react";

export default function Weekly() {
  const { habits } = useHabits();
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50 animate-in fade-in duration-500">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-xl">🗓️</div>
        <h3 className="font-medium text-foreground mb-1">No data yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Add some habits to see your weekly progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif text-foreground">Weekly rhythm</h2>
        <p className="text-muted-foreground">Keep the chain unbroken.</p>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="flex mb-4">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex-1 flex justify-between px-2">
              {days.map((d, i) => (
                <div key={i} className="text-xs font-medium text-muted-foreground flex flex-col items-center">
                  <span>{format(d, 'eeeee')}</span>
                  <span className="mt-1">{format(d, 'd')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {habits.map(habit => {
              const streaks = calculateStreaks(habit.completions);
              return (
                <div key={habit.id} className="flex items-center">
                  <div className="w-32 flex-shrink-0 flex items-center gap-2 pr-2">
                    <span className="text-sm">{habit.emoji}</span>
                    <span className="text-sm font-medium truncate" title={habit.name}>{habit.name}</span>
                  </div>
                  <div className="flex-1 flex justify-between px-2">
                    {days.map((d, i) => {
                      const dateStr = format(d, 'yyyy-MM-dd');
                      const isCompleted = habit.completions.includes(dateStr);
                      return (
                        <div key={i} className="w-6 h-6 flex items-center justify-center">
                          <div 
                            className="w-4 h-4 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: isCompleted ? habit.color : 'var(--color-muted)',
                              opacity: isCompleted ? 1 : 0.3
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Streaks</h3>
        <div className="grid gap-3">
          {habits.map(habit => {
            const streaks = calculateStreaks(habit.completions);
            return (
              <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
                <div className="flex items-center gap-3">
                  <span>{habit.emoji}</span>
                  <span className="font-medium text-sm">{habit.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Current</span>
                    <span className="font-medium">{streaks.current} {streaks.current === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Best</span>
                    <span className="font-medium">{streaks.longest} {streaks.longest === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
