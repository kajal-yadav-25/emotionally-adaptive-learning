import { useMood, MoodType, moodConfig } from '@/contexts/MoodContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodSelector({ className, size = 'md' }: MoodSelectorProps) {
  const { mood, setMood, moodColors } = useMood();

  const moods = Object.entries(moodConfig) as [MoodType, typeof moodColors][];

  const sizeClasses = {
    sm: 'p-2 text-lg',
    md: 'p-3 text-2xl',
    lg: 'p-4 text-3xl'
  };

  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
      {moods.map(([moodType, config]) => (
        <motion.button
          key={moodType}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMood(moodType)}
          className={cn(
            'rounded-xl transition-all duration-300 flex flex-col items-center gap-1',
            sizeClasses[size],
            mood === moodType
              ? `bg-gradient-to-br ${config.gradient} shadow-lg ${config.glow}`
              : 'bg-secondary/50 hover:bg-secondary'
          )}
        >
          <span className="filter drop-shadow-lg">{config.emoji}</span>
          {size !== 'sm' && (
            <span className="text-xs font-medium text-foreground/80">{config.label}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
