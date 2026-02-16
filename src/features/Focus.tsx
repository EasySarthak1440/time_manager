import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Coffee, Brain, ListChecks } from 'lucide-react';
import { cn } from '../lib/utils';
import { playAlarmSound } from '../lib/audio';
import { useSettings } from '../context/SettingsContext';

type SessionType = 'work' | 'shortBreak' | 'longBreak';

export function FocusFeature() {
  const { soundEnabled, selectedSound } = useSettings();
  const [session, setSession] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');
  const timerRef = useRef<number | null>(null);

  const configs = {
    work: { label: 'Focus Time', duration: 25 * 60, color: 'text-primary', bg: 'bg-primary/10', icon: Brain },
    shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-green-400', bg: 'bg-green-400/10', icon: Coffee },
    longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Coffee },
  };

  const currentConfig = configs[session];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundEnabled) playAlarmSound(false, selectedSound);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, currentConfig.label, soundEnabled, selectedSound]);

  const switchSession = (type: SessionType) => {
    setIsRunning(false);
    setSession(type);
    setTimeLeft(configs[type].duration);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now().toString(), text: newTask, completed: false }, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Focus Mode</h2>
          <p className="text-slate-400">Maximize your productivity with Pomodoro.</p>
        </div>
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
          {(['work', 'shortBreak', 'longBreak'] as SessionType[]).map((type) => (
            <button
              key={type}
              onClick={() => switchSession(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                session === type ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {type === 'work' ? 'Focus' : type === 'shortBreak' ? 'Short' : 'Long'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={cn(
            "flex flex-col items-center py-20 rounded-3xl border transition-colors duration-500 backdrop-blur-sm",
            session === 'work' ? "bg-primary/5 border-primary/20" : session === 'shortBreak' ? "bg-green-400/5 border-green-400/20" : "bg-blue-400/5 border-blue-400/20"
          )}>
            <div className={cn("p-4 rounded-full mb-6", currentConfig.bg)}>
              <currentConfig.icon className={currentConfig.color} size={32} />
            </div>
            <h3 className={cn("text-xl font-medium mb-4 uppercase tracking-widest", currentConfig.color)}>
              {currentConfig.label}
            </h3>
            <span className="text-9xl font-black tabular-nums tracking-tighter">
              {formatTime(timeLeft)}
            </span>

            <div className="flex gap-6 mt-12">
              <button
                onClick={() => setTimeLeft(currentConfig.duration)}
                className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <RotateCcw size={24} />
              </button>
              
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  "px-10 h-16 rounded-full flex items-center justify-center transition-all transform active:scale-95 font-bold text-lg",
                  isRunning 
                    ? "bg-slate-800 border border-slate-700 hover:bg-slate-700" 
                    : "bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20"
                )}
              >
                {isRunning ? "PAUSE" : "START FOCUSING"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 flex flex-col h-full">
          <div className="p-6 border-b border-slate-800 flex items-center gap-2">
            <ListChecks className="text-primary" size={20} />
            <h3 className="font-bold text-lg">Tasks</h3>
          </div>
          
          <div className="p-4">
            <form onSubmit={addTask} className="relative">
              <input
                type="text"
                placeholder="What are you working on?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-primary transition-colors text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-slate-950 rounded-lg text-xs font-bold"
              >
                ADD
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer group flex items-center gap-3",
                    task.completed 
                      ? "bg-slate-800/30 border-slate-800 opacity-60" 
                      : "bg-slate-800 border-slate-700 hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                    task.completed ? "bg-primary border-primary" : "border-slate-600 group-hover:border-primary"
                  )}>
                    {task.completed && <div className="w-2 h-2 bg-slate-950 rounded-full" />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-all",
                    task.completed ? "line-through text-slate-500" : "text-slate-200"
                  )}>
                    {task.text}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <p className="text-sm italic">Focus on one task at a time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
