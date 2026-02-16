import { useState, useEffect } from 'react';
import { Plus, Trash2, BellRing, BellOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { playAlarmSound, stopAlarmSound } from '../lib/audio';
import { useTime } from '../hooks/useTime';
import { useSettings } from '../context/SettingsContext';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

export function AlarmFeature() {
  const time = useTime();
  const { soundEnabled, selectedSound } = useSettings();
  const [isRinging, setIsRinging] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00', label: 'Morning Wakeup', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: '2', time: '08:30', label: 'Gym Session', enabled: false, days: ['Mon', 'Wed', 'Fri'] },
  ]);

  useEffect(() => {
    const currentTimeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const currentDay = time.toLocaleDateString([], { weekday: 'short' });
    
    const activeAlarm = alarms.find(a => 
      a.enabled && 
      a.time === currentTimeStr && 
      a.days.includes(currentDay) &&
      time.getSeconds() === 0
    );

    if (activeAlarm && soundEnabled) {
      playAlarmSound(true, selectedSound);
      setIsRinging(true);
    }
  }, [time, alarms, soundEnabled, selectedSound]);

  const handleStopAlarm = () => {
    stopAlarmSound();
    setIsRinging(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Alarms</h2>
          <p className="text-slate-400">Never miss an important moment.</p>
        </div>
        <div className="flex gap-4">
          {isRinging && (
            <button 
              onClick={handleStopAlarm}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 animate-bounce"
            >
              <BellOff size={20} />
              <span>STOP ALARM</span>
            </button>
          )}
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-950 font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            <Plus size={20} />
            <span>Add Alarm</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alarms.map((alarm) => (
          <div 
            key={alarm.id} 
            className={cn(
              "group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden",
              alarm.enabled 
                ? "bg-slate-900 border-slate-700 hover:border-primary/50" 
                : "bg-slate-900/40 border-slate-800/50 opacity-70"
            )}
          >
            {alarm.enabled && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            )}
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className={cn(
                  "text-5xl font-black tracking-tight",
                  alarm.enabled ? "text-white" : "text-slate-500"
                )}>
                  {alarm.time}
                </span>
                <p className="text-slate-400 font-medium mt-1">{alarm.label}</p>
              </div>
              <button 
                onClick={() => toggleAlarm(alarm.id)}
                className={cn(
                  "w-14 h-8 rounded-full relative transition-colors duration-300 p-1",
                  alarm.enabled ? "bg-primary" : "bg-slate-700"
                )}
              >
                <div className={cn(
                  "w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md",
                  alarm.enabled ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>

            <div className="mt-8 flex justify-between items-center relative z-10">
              <div className="flex gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                   const daysMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                   const isActive = alarm.days.includes(daysMap[i]);
                   return (
                     <span 
                       key={i} 
                       className={cn(
                         "w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors",
                         isActive 
                           ? alarm.enabled ? "bg-primary/20 text-primary" : "bg-slate-700 text-slate-400"
                           : "text-slate-700"
                       )}
                     >
                       {day}
                     </span>
                   )
                })}
              </div>
              <div className="flex gap-2">
                <button 
                   onClick={() => deleteAlarm(alarm.id)}
                   className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-slate-600">
        <BellRing size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Alarms will ring even if the tab is in the background.</p>
      </div>
    </div>
  );
}
