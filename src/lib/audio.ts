// Enhanced audio utility with 5 distinct sounds
let audioCtx: AudioContext | null = null;
let alarmInterval: number | null = null;
let activeNodes: AudioNode[] = [];

const cleanNodes = () => {
  activeNodes.forEach(node => {
    try { node.disconnect(); } catch (e) {}
  });
  activeNodes = [];
};

export const stopAlarmSound = () => {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  cleanNodes();
};

const createOscillator = (type: OscillatorType, freq: number, startTime: number, duration: number, volume: number) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
  activeNodes.push(osc, gain);
};

const sounds: Record<string, (now: number) => void> = {
  digital: (now) => {
    createOscillator('square', 1000, now, 0.2, 0.1);
    createOscillator('square', 1000, now + 0.3, 0.2, 0.1);
  },
  siren: (now) => {
    const osc = audioCtx!.createOscillator();
    const lfo = audioCtx!.createOscillator();
    const lfoGain = audioCtx!.createGain();
    const gain = audioCtx!.createGain();
    osc.type = 'sawtooth';
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2, now);
    lfoGain.gain.setValueAtTime(150, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    gain.gain.setValueAtTime(0.05, now);
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start(now);
    osc.stop(now + 1);
    lfo.start(now);
    lfo.stop(now + 1);
    activeNodes.push(osc, lfo, lfoGain, gain);
  },
  chime: (now) => {
    [440, 554, 659, 880].forEach((freq, i) => {
      createOscillator('sine', freq, now + (i * 0.1), 0.8, 0.05);
    });
  },
  pulse: (now) => {
    createOscillator('sine', 200, now, 0.4, 0.2);
    createOscillator('sine', 150, now + 0.5, 0.4, 0.2);
  },
  retro: (now) => {
    createOscillator('triangle', 600, now, 0.1, 0.1);
    createOscillator('triangle', 800, now + 0.1, 0.1, 0.1);
    createOscillator('triangle', 1000, now + 0.2, 0.1, 0.1);
  }
};

export const playAlarmSound = (loop = false, type = 'digital') => {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  stopAlarmSound();
  const soundFn = sounds[type] || sounds.digital;
  
  soundFn(audioCtx.currentTime);
  if (loop) {
    alarmInterval = window.setInterval(() => {
      if (audioCtx) soundFn(audioCtx.currentTime);
    }, 1200);
  }
};
