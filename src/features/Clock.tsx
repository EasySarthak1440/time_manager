import { useTime } from '../hooks/useTime';
import { Globe } from 'lucide-react';

export function ClockFeature() {
  const time = useTime();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold">World Clock</h2>
        <p className="text-slate-400">Keep track of time across the globe.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <span className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
          {formatTime(time)}
        </span>
        <span className="text-xl md:text-2xl text-slate-400 mt-4 font-medium italic">
          {formatDate(time)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { city: 'New York', timezone: 'America/New_York' },
          { city: 'London', timezone: 'Europe/London' },
          { city: 'Tokyo', timezone: 'Asia/Tokyo' },
        ].map((item) => (
          <div key={item.city} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
            <div>
              <p className="text-slate-400 text-sm font-medium">{item.city}</p>
              <p className="text-2xl font-bold mt-1">
                {time.toLocaleTimeString([], { 
                  timeZone: item.timezone, 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false
                })}
              </p>
            </div>
            <Globe className="text-slate-700 group-hover:text-primary/50 transition-colors" size={32} />
          </div>
        ))}
      </div>
    </div>
  );
}
