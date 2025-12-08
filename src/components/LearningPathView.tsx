import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMood } from '@/contexts/MoodContext';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  Clock, 
  CheckCircle2,
  BookOpen,
  Video,
  Trophy,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LearningModule {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
}

const generateModules = (topic: string): LearningModule[] => [
  { id: 1, title: `Introduction to ${topic}`, type: 'video', duration: '15 min', completed: false },
  { id: 2, title: `Core Concepts of ${topic}`, type: 'article', duration: '10 min', completed: false },
  { id: 3, title: `Setting Up Your ${topic} Environment`, type: 'video', duration: '20 min', completed: false },
  { id: 4, title: 'Knowledge Check', type: 'quiz', duration: '5 min', completed: false },
  { id: 5, title: `Building Your First ${topic} Project`, type: 'video', duration: '30 min', completed: false },
  { id: 6, title: 'Best Practices & Patterns', type: 'article', duration: '15 min', completed: false },
  { id: 7, title: 'Advanced Techniques', type: 'video', duration: '25 min', completed: false },
  { id: 8, title: 'Final Assessment', type: 'quiz', duration: '15 min', completed: false },
];

export function LearningPathView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moodColors } = useMood();
  const pathData = location.state as { topic: string; mood: string; speed: string; format: string; goal: string } | null;
  
  const [modules, setModules] = useState<LearningModule[]>(
    generateModules(pathData?.topic || 'Learning')
  );

  const toggleComplete = (id: number) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const completedCount = modules.filter(m => m.completed).length;
  const progress = (completedCount / modules.length) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'quiz': return Trophy;
      default: return BookOpen;
    }
  };

  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No learning path found</h2>
          <Button onClick={() => navigate('/create-path')}>Create One</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${moodColors.gradient} rounded-full blur-3xl opacity-10`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Path Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${moodColors.gradient}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-sm text-muted-foreground uppercase tracking-wide">Learning Path</span>
              </div>
              <h1 className="font-display text-4xl font-bold mb-2">{pathData.topic}</h1>
              <p className="text-muted-foreground">{pathData.goal}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <Flame className={`w-6 h-6 text-orange-500`} />
                  {completedCount}
                </div>
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${moodColors.gradient}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const Icon = getTypeIcon(module.type);
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'glass-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all duration-300',
                  module.completed 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'hover:border-border'
                )}
                onClick={() => toggleComplete(module.id)}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                  module.completed 
                    ? `bg-gradient-to-br ${moodColors.gradient}` 
                    : 'bg-muted'
                )}>
                  {module.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    'font-semibold transition-all',
                    module.completed && 'line-through text-muted-foreground'
                  )}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="capitalize">{module.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.duration}
                    </span>
                  </div>
                </div>
                <Button 
                  variant={module.completed ? 'ghost' : 'mood'} 
                  size="sm"
                  className="shrink-0"
                >
                  {module.completed ? 'Review' : (
                    <>
                      <Play className="w-4 h-4" />
                      Start
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
