import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const COLORS = [
  "#e76f51", // terracotta
  "#f4a261", // sandy orange
  "#e9c46a", // warm yellow
  "#2a9d8f", // muted teal
  "#264653", // deep teal
  "#457b9d", // muted blue
  "#1d3557", // deep blue
  "#a2d2ff", // light blue
  "#b5838d", // muted rose
  "#6d6875", // dusty purple
];

const EMOJIS = ["🌱", "💧", "📚", "🧘‍♀️", "🏃‍♂️", "✍️", "🥗", "🌙", "☀️", "🍵", "🧹", "💊", "🛏️", "🧘‍♂️", "🚶‍♀️", "🎨", "🎵", "📱"];

export default function Manage() {
  const { habits, addHabit, deleteHabit } = useHabits();
  const [isAdding, setIsAdding] = useState(false);
  
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    addHabit({ name: name.trim(), emoji, color });
    setName("");
    setEmoji(EMOJIS[0]);
    setColor(COLORS[0]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-foreground">Manage rituals</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2" data-testid="button-add-habit">
            <Plus className="w-4 h-4" /> Add
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-5 rounded-xl border bg-card shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Read 10 pages"
                  autoFocus
                  data-testid="input-habit-name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`h-10 text-xl rounded-md flex items-center justify-center transition-colors ${emoji === e ? 'bg-primary/10 border-primary border' : 'bg-muted hover:bg-muted/80 border border-transparent'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary ring-offset-background' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={!name.trim()}>
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
              >
                {habit.emoji}
              </div>
              <span className="font-medium">{habit.name}</span>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete ritual?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{habit.name}" and all its history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHabit(habit.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        
        {habits.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No rituals configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
