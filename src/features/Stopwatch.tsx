import { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { cn } from '../lib/utils';

export function StopwatchFeature() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const startStopwatch = () => {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const resetStopwatch = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([time, ...laps]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      ms: centiseconds.toString().padStart(2, '0'),
    };
  };

  const { m, s, ms } = formatTime(time);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold">Stopwatch</h2>
        <p className="text-slate-400">Measure elapsed time with precision.</p>
      </header>

      <div className="flex flex-col items-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-baseline gap-2 font-mono tabular-nums">
          <span className="text-8xl font-black text-white">{m}</span>
          <span className="text-4xl font-bold text-slate-500">:</span>
          <span className="text-8xl font-black text-white">{s}</span>
          <span className="text-4xl font-bold text-primary">.{ms}</span>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            onClick={resetStopwatch}
            className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
          
          <button
            onClick={startStopwatch}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95",
              isRunning ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
          >
            {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={addLap}
            disabled={!isRunning && time === 0}
            className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flag size={24} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-semibold text-slate-300 flex items-center gap-2">
            <Flag size={18} /> Laps
          </h3>
          <span className="text-xs text-slate-500 uppercase tracking-widest">{laps.length} Total</span>
        </div>
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {laps.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {laps.map((lapTime, index) => {
                const formatted = formatTime(lapTime);
                const diff = index < laps.length - 1 ? lapTime - laps[index + 1] : lapTime;
                const diffFormatted = formatTime(diff);
                
                return (
                  <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <span className="text-slate-500 font-mono">#{laps.length - index}</span>
                    <span className="text-xl font-mono">
                      {formatted.m}:{formatted.s}.<span className="text-primary text-sm">{formatted.ms}</span>
                    </span>
                    <span className="text-slate-500 text-sm font-mono">
                      +{diffFormatted.m}:{diffFormatted.s}.{diffFormatted.ms}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 italic">
              No laps recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
