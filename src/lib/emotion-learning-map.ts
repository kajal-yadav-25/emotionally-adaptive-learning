import { MoodType } from '@/contexts/MoodContext';

export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'challenge';

export interface EmotionStrategy {
  difficulty: DifficultyLevel;
  label: string;
  description: string;
  icon: string;
  pacing: 'slow' | 'normal' | 'fast' | 'skip-ahead';
  contentStyle: 'gentle' | 'standard' | 'intensive' | 'exploratory' | 'quick-wins';
  showHints: boolean;
  moduleCount: number; // how many modules to generate
  encouragementMessage: string;
}

/**
 * Maps each emotional state to a personalized learning strategy.
 *
 * Emotion → System Action:
 * - Energetic / Motivated → Increase difficulty, intensive content
 * - Calm / Focused → Continue current level, standard pacing
 * - Creative / Curious → Deep exploration, extra modules
 * - Sad / Anxious → Reduce difficulty, gentle pacing, show hints
 * - Bored → Skip ahead, harder challenges
 * - Unmotivated → Small wins, easy quick modules
 */
export const emotionStrategyMap: Record<MoodType, EmotionStrategy> = {
  energetic: {
    difficulty: 'hard',
    label: 'Intensive Mode',
    description: 'High energy detected — pushing you with advanced challenges',
    icon: '⚡',
    pacing: 'fast',
    contentStyle: 'intensive',
    showHints: false,
    moduleCount: 10,
    encouragementMessage: "You're fired up! Let's channel that energy into mastering advanced concepts.",
  },
  motivated: {
    difficulty: 'hard',
    label: 'Ambitious Path',
    description: 'High motivation — loading project-based challenges',
    icon: '🚀',
    pacing: 'fast',
    contentStyle: 'intensive',
    showHints: false,
    moduleCount: 10,
    encouragementMessage: "Your motivation is your superpower! Let's tackle something big.",
  },
  curious: {
    difficulty: 'moderate',
    label: 'Deep Exploration',
    description: 'Curiosity detected — adding deep-dive modules and extras',
    icon: '🔍',
    pacing: 'normal',
    contentStyle: 'exploratory',
    showHints: false,
    moduleCount: 12,
    encouragementMessage: "Let's satisfy that curiosity with deep explorations and hidden gems!",
  },
  creative: {
    difficulty: 'moderate',
    label: 'Creative Lab',
    description: 'Creative mood — focusing on hands-on projects and experiments',
    icon: '🎨',
    pacing: 'normal',
    contentStyle: 'exploratory',
    showHints: false,
    moduleCount: 10,
    encouragementMessage: "Time to experiment! Build, break things, and discover new approaches.",
  },
  focused: {
    difficulty: 'moderate',
    label: 'Focused Track',
    description: 'Focused state — balanced and structured learning path',
    icon: '🎯',
    pacing: 'normal',
    contentStyle: 'standard',
    showHints: false,
    moduleCount: 8,
    encouragementMessage: "You're in the zone. This structured path will maximize your focus.",
  },
  calm: {
    difficulty: 'moderate',
    label: 'Steady Journey',
    description: 'Calm state — relaxed pacing for thorough understanding',
    icon: '🌊',
    pacing: 'slow',
    contentStyle: 'standard',
    showHints: false,
    moduleCount: 8,
    encouragementMessage: "No rush — let's take it steady and build deep understanding.",
  },
  sad: {
    difficulty: 'easy',
    label: 'Gentle Learning',
    description: 'Taking it easy — shorter modules with encouraging content',
    icon: '💙',
    pacing: 'slow',
    contentStyle: 'gentle',
    showHints: true,
    moduleCount: 5,
    encouragementMessage: "It's okay to take it slow. Every small step counts. You've got this! 💪",
  },
  anxious: {
    difficulty: 'easy',
    label: 'Calm & Guided',
    description: 'Step-by-step guidance with hints and smaller modules',
    icon: '🤲',
    pacing: 'slow',
    contentStyle: 'gentle',
    showHints: true,
    moduleCount: 6,
    encouragementMessage: "Take a deep breath. We'll go step by step — no pressure at all.",
  },
  bored: {
    difficulty: 'challenge',
    label: 'Challenge Mode',
    description: 'Boredom detected — skipping basics, jumping to advanced challenges',
    icon: '🔥',
    pacing: 'skip-ahead',
    contentStyle: 'intensive',
    showHints: false,
    moduleCount: 8,
    encouragementMessage: "Let's shake things up! Straight to the exciting, challenging stuff.",
  },
  unmotivated: {
    difficulty: 'easy',
    label: 'Quick Wins',
    description: 'Building momentum with small, achievable milestones',
    icon: '✨',
    pacing: 'slow',
    contentStyle: 'quick-wins',
    showHints: true,
    moduleCount: 5,
    encouragementMessage: "Small wins build big momentum. Let's start with something easy and satisfying!",
  },
};

export function getEmotionStrategy(mood: MoodType): EmotionStrategy {
  return emotionStrategyMap[mood];
}

/**
 * Returns a difficulty badge color class based on the difficulty level.
 */
export function getDifficultyColor(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'easy': return 'from-green-500 to-emerald-500';
    case 'moderate': return 'from-blue-500 to-cyan-500';
    case 'hard': return 'from-orange-500 to-red-500';
    case 'challenge': return 'from-red-600 to-pink-600';
  }
}

export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 'easy': return 'Easy';
    case 'moderate': return 'Moderate';
    case 'hard': return 'Advanced';
    case 'challenge': return 'Challenge';
  }
}
