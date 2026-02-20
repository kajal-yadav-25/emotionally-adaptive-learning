import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MoodType = 'energetic' | 'calm' | 'focused' | 'creative' | 'motivated' | 'sad' | 'anxious' | 'bored' | 'unmotivated' | 'curious';

interface MoodContextType {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
  moodColors: {
    primary: string;
    gradient: string;
    glow: string;
    emoji: string;
    label: string;
    description: string;
    particleSpeed: number;
    particleCount: number;
    bgPattern: 'grid' | 'dots' | 'waves' | 'none';
    animationIntensity: 'low' | 'medium' | 'high';
  };
}

const moodConfig: Record<MoodType, MoodContextType['moodColors']> = {
  energetic: {
    primary: 'hsl(25, 95%, 53%)',
    gradient: 'from-orange-500 to-yellow-500',
    glow: 'shadow-orange-500/30',
    emoji: '⚡',
    label: 'Energetic',
    description: 'High energy for intensive learning',
    particleSpeed: 4,
    particleCount: 30,
    bgPattern: 'grid',
    animationIntensity: 'high',
  },
  calm: {
    primary: 'hsl(210, 70%, 50%)',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/30',
    emoji: '🌊',
    label: 'Calm',
    description: 'Relaxed pace for deep understanding',
    particleSpeed: 12,
    particleCount: 10,
    bgPattern: 'waves',
    animationIntensity: 'low',
  },
  focused: {
    primary: 'hsl(142, 70%, 45%)',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/30',
    emoji: '🎯',
    label: 'Focused',
    description: 'Concentrated on specific goals',
    particleSpeed: 8,
    particleCount: 15,
    bgPattern: 'grid',
    animationIntensity: 'medium',
  },
  creative: {
    primary: 'hsl(280, 70%, 55%)',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/30',
    emoji: '✨',
    label: 'Creative',
    description: 'Exploring and experimenting',
    particleSpeed: 6,
    particleCount: 25,
    bgPattern: 'dots',
    animationIntensity: 'high',
  },
  motivated: {
    primary: 'hsl(340, 80%, 55%)',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/30',
    emoji: '🚀',
    label: 'Motivated',
    description: 'Ready to achieve great things',
    particleSpeed: 5,
    particleCount: 25,
    bgPattern: 'grid',
    animationIntensity: 'high',
  },
  sad: {
    primary: 'hsl(220, 40%, 40%)',
    gradient: 'from-slate-500 to-blue-800',
    glow: 'shadow-slate-500/20',
    emoji: '😔',
    label: 'Sad',
    description: 'Gentle content to lift your spirits',
    particleSpeed: 16,
    particleCount: 6,
    bgPattern: 'waves',
    animationIntensity: 'low',
  },
  anxious: {
    primary: 'hsl(45, 90%, 50%)',
    gradient: 'from-amber-400 to-yellow-600',
    glow: 'shadow-amber-500/30',
    emoji: '😰',
    label: 'Anxious',
    description: 'Calming exercises before learning',
    particleSpeed: 3,
    particleCount: 35,
    bgPattern: 'dots',
    animationIntensity: 'high',
  },
  bored: {
    primary: 'hsl(180, 50%, 45%)',
    gradient: 'from-teal-400 to-cyan-600',
    glow: 'shadow-teal-500/25',
    emoji: '😴',
    label: 'Bored',
    description: 'Engaging challenges to spark interest',
    particleSpeed: 14,
    particleCount: 8,
    bgPattern: 'none',
    animationIntensity: 'low',
  },
  unmotivated: {
    primary: 'hsl(0, 50%, 45%)',
    gradient: 'from-red-800 to-orange-900',
    glow: 'shadow-red-800/20',
    emoji: '😩',
    label: 'Unmotivated',
    description: 'Small wins to build momentum',
    particleSpeed: 18,
    particleCount: 5,
    bgPattern: 'none',
    animationIntensity: 'low',
  },
  curious: {
    primary: 'hsl(50, 85%, 55%)',
    gradient: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/30',
    emoji: '🤔',
    label: 'Curious',
    description: 'Deep-dive exploration mode',
    particleSpeed: 7,
    particleCount: 20,
    bgPattern: 'dots',
    animationIntensity: 'medium',
  },
};

const allMoodClasses = Object.keys(moodConfig).map(m => `mood-${m}`);

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<MoodType>('energetic');

  const setMood = (newMood: MoodType) => {
    setMoodState(newMood);
    document.body.classList.remove(...allMoodClasses);
    document.body.classList.add(`mood-${newMood}`);
  };

  useEffect(() => {
    document.body.classList.add(`mood-${mood}`);
    return () => {
      document.body.classList.remove(`mood-${mood}`);
    };
  }, []);

  return (
    <MoodContext.Provider value={{ mood, setMood, moodColors: moodConfig[mood] }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}

export { moodConfig };
