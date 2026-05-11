import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Habit, useHabits } from "@/hooks/use-habits";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

function CustomConfetti() {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: -(Math.random() * 100 + 50),
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{ 
            opacity: 0, 
            x: `${piece.x}vw`, 
            y: `100vh`, 
            rotate: piece.rotation + 360,
            scale: 1 
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { habits, toggleCompletion } = useHabits();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const completedCount = habits.filter(h => h.completions.includes(todayStr)).length;
  const totalCount = habits.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string, isCompleted: boolean) => {
    toggleCompletion(id, todayStr);
    
    if (!isCompleted && completedCount + 1 === totalCount && totalCount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showConfetti && <CustomConfetti />}
      <div className="space-y-2">
        <h2 className="text-3xl font-serif text-foreground">{format(new Date(), 'EEEE, MMMM d')}</h2>
        {totalCount > 0 ? (
          <p className="text-muted-foreground">
            {completedCount} of {totalCount} rituals completed
          </p>
        ) : (
          <p className="text-muted-foreground">Let's build a new routine.</p>
        )}
        
        {totalCount > 0 && (
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-4">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {habits.map(habit => {
            const isCompleted = habit.completions.includes(todayStr);
            return (
              <motion.button
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggle(habit.id, isCompleted)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-card/50 border-transparent shadow-sm' 
                    : 'bg-card border-border/50 shadow-sm hover:shadow-md'
                }`}
                style={isCompleted ? { opacity: 0.6 } : {}}
                data-testid={`habit-toggle-${habit.id}`}
              >
                <div 
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-300`}
                  style={{ 
                    backgroundColor: isCompleted ? 'var(--color-muted)' : `${habit.color}15`,
                    color: isCompleted ? 'var(--color-muted-foreground)' : habit.color 
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="emoji"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {habit.emoji}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium transition-colors ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {habit.name}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
        
        {habits.length === 0 && (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-xl">
              <span>🌱</span>
            </div>
            <h3 className="font-medium text-foreground mb-1">Your space is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Start small. Add your first daily ritual.</p>
          </div>
        )}
      </div>
    </div>
  );
}
