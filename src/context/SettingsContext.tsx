import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  format24h: boolean;
  setFormat24h: (enabled: boolean) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [format24h, setFormat24h] = useState(() => {
    const saved = localStorage.getItem('format24h');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedSound, setSelectedSound] = useState(() => {
    const saved = localStorage.getItem('selectedSound');
    return saved !== null ? saved : 'digital';
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('format24h', JSON.stringify(format24h));
  }, [format24h]);

  useEffect(() => {
    localStorage.setItem('selectedSound', selectedSound);
  }, [selectedSound]);

  return (
    <SettingsContext.Provider value={{ 
      soundEnabled, setSoundEnabled, 
      format24h, setFormat24h, 
      selectedSound, setSelectedSound 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}