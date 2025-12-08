import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MoodType = 'energetic' | 'calm' | 'focused' | 'creative' | 'motivated';

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
  };
}

const moodConfig: Record<MoodType, MoodContextType['moodColors']> = {
  energetic: {
    primary: 'hsl(25, 95%, 53%)',
    gradient: 'from-orange-500 to-yellow-500',
    glow: 'shadow-orange-500/30',
    emoji: '⚡',
    label: 'Energetic',
    description: 'High energy for intensive learning'
  },
  calm: {
    primary: 'hsl(210, 70%, 50%)',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/30',
    emoji: '🌊',
    label: 'Calm',
    description: 'Relaxed pace for deep understanding'
  },
  focused: {
    primary: 'hsl(142, 70%, 45%)',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/30',
    emoji: '🎯',
    label: 'Focused',
    description: 'Concentrated on specific goals'
  },
  creative: {
    primary: 'hsl(280, 70%, 55%)',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/30',
    emoji: '✨',
    label: 'Creative',
    description: 'Exploring and experimenting'
  },
  motivated: {
    primary: 'hsl(340, 80%, 55%)',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/30',
    emoji: '🚀',
    label: 'Motivated',
    description: 'Ready to achieve great things'
  }
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<MoodType>('energetic');

  const setMood = (newMood: MoodType) => {
    setMoodState(newMood);
    document.body.classList.remove('mood-energetic', 'mood-calm', 'mood-focused', 'mood-creative', 'mood-motivated');
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
