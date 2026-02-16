import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { playAlarmSound, stopAlarmSound } from '../lib/audio';
import { useSettings } from '../context/SettingsContext';

export function TimerFeature() {
  const { soundEnabled, selectedSound } = useSettings();
  const [initialTime, setInitialTime] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [customInput, setCustomInput] = useState({ h: 0, m: 5, s: 0 });
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timeLeft === 0) return;
    setIsRunning(!isRunning);
    if (isRinging) {
      stopAlarmSound();
      setIsRinging(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    stopAlarmSound();
    setIsRinging(false);
  };

  const setPreset = (seconds: number) => {
    setIsRunning(false);
    setInitialTime(seconds);
    setTimeLeft(seconds);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = customInput.h * 3600 + customInput.m * 60 + customInput.s;
    setPreset(totalSeconds);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundEnabled) {
        playAlarmSound(true, selectedSound);
        setIsRinging(true);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, soundEnabled, selectedSound]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0'),
    };
  };

  const { h, m, s } = formatTime(timeLeft);
  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Timer</h2>
          <p className="text-slate-400">Set a countdown for your activities.</p>
        </div>
        {isRinging && (
          <button 
            onClick={() => { stopAlarmSound(); setIsRinging(false); }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 animate-bounce"
          >
            <BellOff size={20} />
            <span>STOP ALARM</span>
          </button>
        )}
      </header>

      <div className="flex flex-col items-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-sm relative">
        {/* Progress ring placeholder or simple bar */}
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />

        <div className="flex items-baseline gap-2 font-mono tabular-nums mt-4">
          <span className="text-8xl font-black text-white">{h}</span>
          <span className="text-4xl font-bold text-slate-600">:</span>
          <span className="text-8xl font-black text-white">{m}</span>
          <span className="text-4xl font-bold text-slate-600">:</span>
          <span className="text-8xl font-black text-white">{s}</span>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
          
          <button
            onClick={startTimer}
            disabled={timeLeft === 0}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 disabled:opacity-50",
              isRunning ? "bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
          >
            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
             <Bell size={24} className={timeLeft === 0 && initialTime > 0 ? "text-primary animate-bounce" : "text-slate-600"} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Quick Presets</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 5, 10, 15, 30, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setPreset(mins * 60)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30 transition-all font-medium"
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-300">Custom Duration</h3>
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1 uppercase tracking-tighter">Hours</label>
                <input 
                  type="number" min="0" max="23" 
                  value={customInput.h}
                  onChange={(e) => setCustomInput({...customInput, h: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:border-primary outline-none" 
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1 uppercase tracking-tighter">Minutes</label>
                <input 
                  type="number" min="0" max="59" 
                  value={customInput.m}
                  onChange={(e) => setCustomInput({...customInput, m: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:border-primary outline-none" 
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1 uppercase tracking-tighter">Seconds</label>
                <input 
                  type="number" min="0" max="59" 
                  value={customInput.s}
                  onChange={(e) => setCustomInput({...customInput, s: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 focus:border-primary outline-none" 
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
            >
              Set Custom Timer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
