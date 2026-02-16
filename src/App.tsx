import { MainLayout } from './layouts/MainLayout';
import { ClockFeature } from './features/Clock';
import { AlarmFeature } from './features/Alarm';
import { StopwatchFeature } from './features/Stopwatch';
import { TimerFeature } from './features/Timer';
import { FocusFeature } from './features/Focus';
import { useSettings } from './context/SettingsContext';
import { cn } from './lib/utils';
import { playAlarmSound } from './lib/audio';
import { Music } from 'lucide-react';

function App() {
  const { soundEnabled, setSoundEnabled, format24h, setFormat24h, selectedSound, setSelectedSound } = useSettings();

  return (
    <MainLayout>
      {(activeTab) => {
        switch (activeTab) {
          case 'clock':
            return <ClockFeature />;
          case 'alarm':
            return <AlarmFeature />;
          case 'stopwatch':
            return <StopwatchFeature />;
          case 'timer':
            return <TimerFeature />;
          case 'focus':
            return <FocusFeature />;
          case 'sounds':
            return (
              <div className="space-y-8 animate-in fade-in duration-500">
                <header>
                  <h2 className="text-3xl font-bold">Sound Library</h2>
                  <p className="text-slate-400">Choose the perfect alert for your activities.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'digital', name: 'Classic Digital', desc: 'Standard sharp beeping' },
                    { id: 'siren', name: 'Emergency Siren', desc: 'Continuous rising siren' },
                    { id: 'chime', name: 'Zen Chime', desc: 'Melodic soothing tones' },
                    { id: 'pulse', name: 'Deep Pulse', desc: 'Low frequency vibration' },
                    { id: 'retro', name: 'Retro Arcade', desc: '8-bit rising melody' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSound(s.id);
                        playAlarmSound(false, s.id);
                      }}
                      className={cn(
                        "p-6 rounded-3xl border text-left transition-all relative overflow-hidden group",
                        selectedSound === s.id 
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      )}
                    >
                      {selectedSound === s.id && (
                        <div className="absolute top-0 right-0 p-4">
                          <Music className="text-primary animate-pulse" size={20} />
                        </div>
                      )}
                      <h3 className={cn("text-xl font-bold", selectedSound === s.id ? "text-primary" : "text-white")}>
                        {s.name}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          case 'settings':
          default:
            return <ClockFeature />;
        }
      }}
    </MainLayout>
  );
}

export default App;