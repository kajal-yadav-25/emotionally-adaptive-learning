import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMood, moodConfig, MoodType } from '@/contexts/MoodContext';
import { useProgress } from '@/contexts/ProgressContext';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  Clock, 
  CheckCircle2,
  BookOpen,
  Video,
  Trophy,
  Flame,
  History,
  ChevronUp,
  ExternalLink,
  Brain,
  Lightbulb,
  Zap,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ModuleQuiz } from '@/components/ModuleQuiz';
import { getEmotionStrategy, getDifficultyColor, getDifficultyLabel, type EmotionStrategy, type DifficultyLevel } from '@/lib/emotion-learning-map';

interface LearningModule {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
  difficulty: DifficultyLevel;
  hint?: string;
  searchQuery?: string;
  articleContent?: string;
}

const getVideoSearchQuery = (topic: string, moduleType: string, difficulty: DifficultyLevel): string => {
  const diffPrefix = difficulty === 'easy' ? 'beginner' : difficulty === 'hard' || difficulty === 'challenge' ? 'advanced' : '';
  const queries: Record<string, string> = {
    'introduction': `${topic} ${diffPrefix} tutorial introduction`,
    'setup': `${topic} setup installation tutorial ${diffPrefix}`,
    'project': `${topic} ${diffPrefix} project tutorial build`,
    'advanced': `${topic} advanced techniques deep dive`,
    'challenge': `${topic} coding challenge problem solving`,
    'deep-dive': `${topic} deep dive explained in depth`,
    'tips': `${topic} tips tricks best practices`,
  };
  return queries[moduleType] || `${topic} ${diffPrefix} tutorial`;
};

const generateArticleContent = (topic: string, moduleTitle: string): string => {
  const topicCapitalized = topic.charAt(0).toUpperCase() + topic.slice(1);
  return `
# ${moduleTitle}

## Introduction
Welcome to this module on ${moduleTitle}. This guide covers key concepts related to ${topicCapitalized}.

## Learning Objectives
- Understand the fundamental concepts of ${moduleTitle.toLowerCase()}
- Apply these concepts in practical scenarios
- Know common patterns and best practices

## Key Concepts

### Understanding the Basics
Before diving deep, establish a solid foundation:
1. **Fundamentals**: The building blocks
2. **Syntax & Structure**: How to organize your code
3. **Common Operations**: Frequently used functions
4. **Error Handling**: Dealing with problems gracefully

### Why ${topicCapitalized} Matters
- Solves real-world problems efficiently
- Large and supportive community
- Integrates well with other technologies

## Practical Steps
1. Set up your environment
2. Create a basic implementation
3. Test and validate
4. Refine and improve

## Tips for Success
- ✅ Take notes while learning
- ✅ Build small projects to reinforce concepts
- ✅ Join online communities
- ✅ Read official documentation
- ❌ Don't skip fundamentals
- ❌ Don't copy-paste without understanding

## Summary
Mastering ${topicCapitalized} takes time. Stay consistent, practice regularly, and enjoy the process!
  `;
};

/**
 * Generates a personalized module list based on the topic, format, AND emotional state.
 */
const generateModules = (topic: string, format: string = 'mixed', mood: MoodType = 'focused'): LearningModule[] => {
  const strategy = getEmotionStrategy(mood);
  const { difficulty, contentStyle, pacing, showHints } = strategy;

  // --- GENTLE / QUICK-WINS: easy, short, encouraging ---
  if (contentStyle === 'gentle' || contentStyle === 'quick-wins') {
    const modules: LearningModule[] = [
      {
        id: 1,
        title: `Friendly Introduction to ${topic}`,
        type: 'video',
        duration: '8 min',
        completed: false,
        difficulty: 'easy',
        hint: `Don't worry about memorizing everything — just get a feel for what ${topic} is about.`,
        searchQuery: getVideoSearchQuery(topic, 'introduction', 'easy'),
      },
      {
        id: 2,
        title: `${topic} Made Simple`,
        type: 'article',
        duration: '5 min',
        completed: false,
        difficulty: 'easy',
        hint: 'Take your time reading. You can always come back to this.',
        articleContent: generateArticleContent(topic, `${topic} Made Simple`),
      },
      {
        id: 3,
        title: 'Quick Check-In',
        type: 'quiz',
        duration: '3 min',
        completed: false,
        difficulty: 'easy',
        hint: 'No pressure! This is just to see what stuck.',
      },
      {
        id: 4,
        title: `Your First Small ${topic} Win`,
        type: 'video',
        duration: '10 min',
        completed: false,
        difficulty: 'easy',
        hint: 'Follow along at your own pace. Pause whenever you need.',
        searchQuery: getVideoSearchQuery(topic, 'setup', 'easy'),
      },
      {
        id: 5,
        title: `Celebrate: ${topic} Basics Mastered!`,
        type: 'article',
        duration: '5 min',
        completed: false,
        difficulty: 'easy',
        hint: 'You made it through! Reflect on what you learned.',
        articleContent: generateArticleContent(topic, `Celebrate: ${topic} Basics Mastered!`),
      },
    ];
    if (contentStyle === 'quick-wins' && strategy.moduleCount > 5) {
      modules.push({
        id: 6,
        title: `Bonus: Fun ${topic} Mini-Project`,
        type: 'video',
        duration: '12 min',
        completed: false,
        difficulty: 'easy',
        hint: 'A fun little project to build confidence!',
        searchQuery: getVideoSearchQuery(topic, 'project', 'easy'),
      });
    }
    return applyFormatFilter(modules, format, topic);
  }

  // --- INTENSIVE: hard/challenge, fast-paced, skip basics ---
  if (contentStyle === 'intensive') {
    const skipBasics = pacing === 'skip-ahead';
    const modules: LearningModule[] = [];
    let id = 1;

    if (!skipBasics) {
      modules.push({
        id: id++,
        title: `${topic} Quick Refresher`,
        type: 'video',
        duration: '10 min',
        completed: false,
        difficulty: 'moderate',
        searchQuery: getVideoSearchQuery(topic, 'introduction', 'moderate'),
      });
    }

    modules.push(
      {
        id: id++,
        title: `Advanced ${topic} Concepts`,
        type: 'video',
        duration: '25 min',
        completed: false,
        difficulty: 'hard',
        searchQuery: getVideoSearchQuery(topic, 'advanced', 'hard'),
      },
      {
        id: id++,
        title: `${topic} Deep Patterns & Architecture`,
        type: 'article',
        duration: '15 min',
        completed: false,
        difficulty: 'hard',
        articleContent: generateArticleContent(topic, `${topic} Deep Patterns & Architecture`),
      },
      {
        id: id++,
        title: 'Knowledge Challenge',
        type: 'quiz',
        duration: '8 min',
        completed: false,
        difficulty: 'hard',
      },
      {
        id: id++,
        title: `Build a Complex ${topic} Project`,
        type: 'video',
        duration: '35 min',
        completed: false,
        difficulty: 'hard',
        searchQuery: getVideoSearchQuery(topic, 'project', 'hard'),
      },
      {
        id: id++,
        title: `${topic} Performance & Optimization`,
        type: 'article',
        duration: '15 min',
        completed: false,
        difficulty: 'hard',
        articleContent: generateArticleContent(topic, `${topic} Performance & Optimization`),
      },
      {
        id: id++,
        title: `${topic} Real-World Problem Solving`,
        type: 'video',
        duration: '30 min',
        completed: false,
        difficulty: 'challenge',
        searchQuery: getVideoSearchQuery(topic, 'challenge', 'challenge'),
      },
      {
        id: id++,
        title: 'Final Boss Assessment',
        type: 'quiz',
        duration: '15 min',
        completed: false,
        difficulty: 'challenge',
      },
    );

    if (strategy.moduleCount >= 10) {
      modules.push(
        {
          id: id++,
          title: `${topic} Expert Tips & Tricks`,
          type: 'video',
          duration: '20 min',
          completed: false,
          difficulty: 'challenge',
          searchQuery: getVideoSearchQuery(topic, 'tips', 'challenge'),
        },
        {
          id: id++,
          title: `${topic} Mastery Project`,
          type: 'video',
          duration: '40 min',
          completed: false,
          difficulty: 'challenge',
          searchQuery: getVideoSearchQuery(topic, 'challenge', 'challenge'),
        },
      );
    }

    return applyFormatFilter(modules, format, topic);
  }

  // --- EXPLORATORY: moderate with extra deep-dives ---
  if (contentStyle === 'exploratory') {
    const modules: LearningModule[] = [
      {
        id: 1,
        title: `Exploring ${topic}: The Big Picture`,
        type: 'video',
        duration: '15 min',
        completed: false,
        difficulty: 'moderate',
        searchQuery: getVideoSearchQuery(topic, 'introduction', 'moderate'),
      },
      {
        id: 2,
        title: `Core Concepts of ${topic}`,
        type: 'article',
        duration: '12 min',
        completed: false,
        difficulty: 'moderate',
        articleContent: generateArticleContent(topic, `Core Concepts of ${topic}`),
      },
      {
        id: 3,
        title: `Deep Dive: How ${topic} Really Works`,
        type: 'video',
        duration: '25 min',
        completed: false,
        difficulty: 'moderate',
        searchQuery: getVideoSearchQuery(topic, 'deep-dive', 'moderate'),
      },
      {
        id: 4,
        title: 'Curiosity Check',
        type: 'quiz',
        duration: '5 min',
        completed: false,
        difficulty: 'moderate',
      },
      {
        id: 5,
        title: `Creative ${topic} Project`,
        type: 'video',
        duration: '30 min',
        completed: false,
        difficulty: 'moderate',
        searchQuery: getVideoSearchQuery(topic, 'project', 'moderate'),
      },
      {
        id: 6,
        title: `${topic} Patterns & Anti-Patterns`,
        type: 'article',
        duration: '15 min',
        completed: false,
        difficulty: 'moderate',
        articleContent: generateArticleContent(topic, `${topic} Patterns & Anti-Patterns`),
      },
      {
        id: 7,
        title: `${topic} Hidden Gems & Undocumented Features`,
        type: 'video',
        duration: '20 min',
        completed: false,
        difficulty: 'hard',
        searchQuery: getVideoSearchQuery(topic, 'tips', 'hard'),
      },
      {
        id: 8,
        title: `Advanced ${topic} Exploration`,
        type: 'video',
        duration: '25 min',
        completed: false,
        difficulty: 'hard',
        searchQuery: getVideoSearchQuery(topic, 'advanced', 'hard'),
      },
      {
        id: 9,
        title: `${topic} Community & Ecosystem`,
        type: 'article',
        duration: '10 min',
        completed: false,
        difficulty: 'moderate',
        articleContent: generateArticleContent(topic, `${topic} Community & Ecosystem`),
      },
      {
        id: 10,
        title: 'Exploration Assessment',
        type: 'quiz',
        duration: '10 min',
        completed: false,
        difficulty: 'moderate',
      },
    ];

    if (strategy.moduleCount >= 12) {
      modules.push(
        {
          id: 11,
          title: `${topic} Experimental Lab`,
          type: 'video',
          duration: '30 min',
          completed: false,
          difficulty: 'hard',
          searchQuery: getVideoSearchQuery(topic, 'challenge', 'hard'),
        },
        {
          id: 12,
          title: `The Future of ${topic}`,
          type: 'article',
          duration: '10 min',
          completed: false,
          difficulty: 'moderate',
          articleContent: generateArticleContent(topic, `The Future of ${topic}`),
        },
      );
    }

    return applyFormatFilter(modules, format, topic);
  }

  // --- STANDARD: balanced, default ---
  const modules: LearningModule[] = [
    {
      id: 1,
      title: `Introduction to ${topic}`,
      type: 'video',
      duration: '15 min',
      completed: false,
      difficulty: 'easy',
      searchQuery: getVideoSearchQuery(topic, 'introduction', 'easy'),
    },
    {
      id: 2,
      title: `Core Concepts of ${topic}`,
      type: 'article',
      duration: '10 min',
      completed: false,
      difficulty: 'moderate',
      articleContent: generateArticleContent(topic, `Core Concepts of ${topic}`),
    },
    {
      id: 3,
      title: `Setting Up Your ${topic} Environment`,
      type: 'video',
      duration: '20 min',
      completed: false,
      difficulty: 'moderate',
      searchQuery: getVideoSearchQuery(topic, 'setup', 'moderate'),
    },
    {
      id: 4,
      title: 'Knowledge Check',
      type: 'quiz',
      duration: '5 min',
      completed: false,
      difficulty: 'moderate',
    },
    {
      id: 5,
      title: `Building Your First ${topic} Project`,
      type: 'video',
      duration: '30 min',
      completed: false,
      difficulty: 'moderate',
      searchQuery: getVideoSearchQuery(topic, 'project', 'moderate'),
    },
    {
      id: 6,
      title: `Best Practices for ${topic}`,
      type: 'article',
      duration: '15 min',
      completed: false,
      difficulty: 'moderate',
      articleContent: generateArticleContent(topic, `Best Practices for ${topic}`),
    },
    {
      id: 7,
      title: `Advanced ${topic} Techniques`,
      type: 'video',
      duration: '25 min',
      completed: false,
      difficulty: 'hard',
      searchQuery: getVideoSearchQuery(topic, 'advanced', 'hard'),
    },
    {
      id: 8,
      title: 'Final Assessment',
      type: 'quiz',
      duration: '15 min',
      completed: false,
      difficulty: 'hard',
    },
  ];

  return applyFormatFilter(modules, format, topic);
};

/** Converts modules to match the chosen format (videos-only, articles-only, or mixed) */
function applyFormatFilter(modules: LearningModule[], format: string, topic: string): LearningModule[] {
  if (format === 'videos') {
    return modules.map(m => {
      if (m.type === 'article') {
        return {
          ...m,
          type: 'video' as const,
          searchQuery: getVideoSearchQuery(topic, 'introduction', m.difficulty),
          articleContent: undefined,
        };
      }
      return m;
    });
  }
  if (format === 'articles') {
    return modules.map(m => {
      if (m.type === 'video') {
        return {
          ...m,
          type: 'article' as const,
          articleContent: generateArticleContent(topic, m.title),
          searchQuery: undefined,
        };
      }
      return m;
    });
  }
  return modules;
}

export function LearningPathView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moodColors } = useMood();
  const { addLearningPath, updateModuleCompletion, removeModuleCompletion, getPathById } = useProgress();
  
  const pathData = location.state as { 
    topic: string; 
    mood: string; 
    speed: string; 
    format: string; 
    goal: string;
    pathId?: string;
  } | null;
  
  const strategy = pathData ? getEmotionStrategy((pathData.mood || 'focused') as MoodType) : null;
  
  const [pathId, setPathId] = useState<string | null>(pathData?.pathId || null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [quizActiveFor, setQuizActiveFor] = useState<number | null>(null);
  const [quizCompletedFor, setQuizCompletedFor] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (pathData) {
      const generatedModules = generateModules(pathData.topic, pathData.format, (pathData.mood || 'focused') as MoodType);
      
      if (pathData.pathId) {
        const existingPath = getPathById(pathData.pathId);
        if (existingPath) {
          const modulesWithCompletion = generatedModules.map(m => ({
            ...m,
            completed: existingPath.completedModules.some(cm => cm.id === m.id)
          }));
          setModules(modulesWithCompletion);
          setPathId(pathData.pathId);
          return;
        }
      }
      
      const newPathId = addLearningPath({
        topic: pathData.topic,
        mood: pathData.mood,
        speed: pathData.speed,
        format: pathData.format,
        goal: pathData.goal,
        totalModules: generatedModules.length
      });
      setPathId(newPathId);
      setModules(generatedModules);
    }
  }, []);

  const toggleComplete = (module: LearningModule) => {
    if (!pathId) return;
    
    const newCompleted = !module.completed;
    
    if (newCompleted) {
      updateModuleCompletion(pathId, {
        id: module.id,
        title: module.title,
        type: module.type,
        completedAt: new Date()
      });
    } else {
      removeModuleCompletion(pathId, module.id);
    }
    
    setModules(modules.map(m => 
      m.id === module.id ? { ...m, completed: newCompleted } : m
    ));
  };

  const handleMarkComplete = (module: LearningModule, e: React.MouseEvent) => {
    e.stopPropagation();
    if (quizCompletedFor.has(module.id)) {
      // Quiz already done, just complete
      toggleComplete(module);
    } else {
      // Show quiz first
      setQuizActiveFor(module.id);
    }
  };

  const handleQuizComplete = (moduleId: number, score: number, total: number) => {
    setQuizActiveFor(null);
    setQuizCompletedFor(prev => new Set(prev).add(moduleId));
    // Auto-complete the module after quiz
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.completed) {
      toggleComplete(module);
    }
  };

  const handleQuizSkip = (moduleId: number) => {
    setQuizActiveFor(null);
    setQuizCompletedFor(prev => new Set(prev).add(moduleId));
    // Complete without quiz
    const module = modules.find(m => m.id === moduleId);
    if (module && !module.completed) {
      toggleComplete(module);
    }
  };

  const toggleExpand = (moduleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const openYouTubeSearch = (query: string) => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  const completedCount = modules.filter(m => m.completed).length;
  const progress = modules.length > 0 ? (completedCount / modules.length) * 100 : 0;

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
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/progress')}>
            <History className="w-4 h-4 mr-2" />
            My Progress
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
              {/* Mood & Strategy Indicator */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {pathData.mood && moodConfig[pathData.mood as MoodType] && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${moodConfig[pathData.mood as MoodType].gradient} text-foreground`}>
                    <Brain className="w-3.5 h-3.5" />
                    {moodConfig[pathData.mood as MoodType].label}
                  </span>
                )}
                {strategy && (
                  <>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${getDifficultyColor(strategy.difficulty)} text-white`}>
                      <Zap className="w-3.5 h-3.5" />
                      {getDifficultyLabel(strategy.difficulty)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary/60 text-foreground">
                      <Shield className="w-3.5 h-3.5" />
                      {strategy.label}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-3xl font-bold">
                  <Flame className="w-6 h-6 text-orange-500" />
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

        {/* Emotion Strategy Banner */}
        {strategy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`glass-card rounded-2xl p-5 mb-8 border border-primary/10`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${getDifficultyColor(strategy.difficulty)} text-white shrink-0`}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold">{strategy.icon} {strategy.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                <p className="text-sm font-medium text-foreground/80 italic">"{strategy.encouragementMessage}"</p>
                {strategy.showHints && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Hints are enabled for this path to help guide you</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const Icon = getTypeIcon(module.type);
            const hasResource = module.type === 'video' || module.type === 'article';
            const isExpanded = expandedModule === module.id;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'glass-card rounded-2xl overflow-hidden transition-all duration-300',
                  module.completed 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'hover:border-border'
                )}
              >
                {/* Module Header */}
                <div className="p-6 flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0',
                    module.completed 
                      ? `bg-gradient-to-br ${moodColors.gradient}` 
                      : 'bg-muted'
                  )}>
                    {module.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-display font-bold text-lg text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-semibold transition-all truncate',
                      module.completed && 'line-through text-muted-foreground'
                    )}>
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1.5 capitalize">
                        <Icon className="w-3.5 h-3.5" />
                        {module.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                      </span>
                      {module.completed && (
                        <span className="text-xs text-primary font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Start button opens the content */}
                    {hasResource && (
                      <Button 
                        variant={isExpanded ? 'outline' : 'mood'} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(module.id, e);
                        }}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Close
                          </>
                        ) : module.completed ? (
                          <>
                            {module.type === 'video' ? <Play className="w-4 h-4 mr-1" /> : <FileText className="w-4 h-4 mr-1" />}
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                    )}
                    {/* Quiz modules get a start that marks complete */}
                    {module.type === 'quiz' && (
                      <Button 
                        variant={module.completed ? 'ghost' : 'mood'} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!module.completed) toggleComplete(module);
                        }}
                        disabled={module.completed}
                      >
                        {module.completed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Done
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Take Quiz
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && hasResource && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        {module.type === 'video' && module.searchQuery && (
                          <div className="space-y-4">
                            <div className="rounded-xl overflow-hidden bg-card/50 border border-border">
                              <div className="aspect-video relative">
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(module.searchQuery)}&autoplay=0`}
                                  title={module.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="p-4 bg-card/30 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openYouTubeSearch(module.searchQuery!)}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  More on YouTube
                                </Button>
                                {!module.completed && quizActiveFor !== module.id && (
                                  <Button 
                                    variant="mood" 
                                    size="sm"
                                    onClick={(e) => handleMarkComplete(module, e)}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Mark as Complete
                                  </Button>
                                )}
                                {module.completed && (
                                  <span className="text-sm text-primary font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                            {quizActiveFor === module.id && (
                              <ModuleQuiz
                                topic={pathData.topic}
                                moduleTitle={module.title}
                                moduleType={module.type}
                                moodGradient={moodColors.gradient}
                                onComplete={(score, total) => handleQuizComplete(module.id, score, total)}
                                onSkip={() => handleQuizSkip(module.id)}
                              />
                            )}
                          </div>
                        )}
                        
                        {module.type === 'article' && module.articleContent && (
                          <div className="space-y-4">
                            <div className="bg-card/50 rounded-xl p-6 max-h-[600px] overflow-y-auto border border-border">
                              <div className="space-y-3">
                                {module.articleContent.split('\n').map((line, i) => {
                                  const trimmedLine = line.trim();
                                  if (!trimmedLine) return null;
                                  
                                  if (trimmedLine.startsWith('# ')) {
                                    return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3 first:mt-0">{trimmedLine.replace('# ', '')}</h1>;
                                  } else if (trimmedLine.startsWith('## ')) {
                                    return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-2">{trimmedLine.replace('## ', '')}</h2>;
                                  } else if (trimmedLine.startsWith('### ')) {
                                    return <h3 key={i} className="text-lg font-medium text-foreground mt-4 mb-2">{trimmedLine.replace('### ', '')}</h3>;
                                  } else if (trimmedLine.startsWith('```')) {
                                    return <div key={i} className="bg-muted/50 rounded-lg p-4 font-mono text-sm my-4">{trimmedLine.replace(/```/g, '')}</div>;
                                  } else if (trimmedLine.startsWith('|')) {
                                    return <div key={i} className="font-mono text-sm text-muted-foreground bg-muted/30 px-2 py-1">{trimmedLine}</div>;
                                  } else if (trimmedLine.startsWith('- ✅') || trimmedLine.startsWith('- ❌')) {
                                    return <p key={i} className="text-muted-foreground ml-4 py-0.5">{trimmedLine.replace('- ', '')}</p>;
                                  } else if (trimmedLine.startsWith('- **')) {
                                    const match = trimmedLine.match(/- \*\*(.+?)\*\*:?\s*(.*)/)
                                    if (match) {
                                      return (
                                        <div key={i} className="flex gap-2 text-muted-foreground ml-4 py-0.5">
                                          <span className="text-primary">•</span>
                                          <span><strong className="text-foreground">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}</span>
                                        </div>
                                      );
                                    }
                                  } else if (trimmedLine.startsWith('- ')) {
                                    return <p key={i} className="text-muted-foreground ml-4 flex gap-2 py-0.5"><span className="text-primary">•</span>{trimmedLine.replace('- ', '')}</p>;
                                  } else if (trimmedLine.match(/^\d+\./)) {
                                    return <p key={i} className="text-muted-foreground ml-4 py-0.5">{trimmedLine}</p>;
                                  } else {
                                    return <p key={i} className="text-muted-foreground leading-relaxed">{trimmedLine}</p>;
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              {!module.completed && quizActiveFor !== module.id ? (
                                <Button 
                                  variant="mood" 
                                  size="sm"
                                  onClick={(e) => handleMarkComplete(module, e)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Mark as Complete
                                </Button>
                              ) : module.completed ? (
                                <span className="text-sm text-primary font-medium flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Completed
                                </span>
                              ) : null}
                            </div>
                            {quizActiveFor === module.id && (
                              <ModuleQuiz
                                topic={pathData.topic}
                                moduleTitle={module.title}
                                moduleType={module.type}
                                moodGradient={moodColors.gradient}
                                onComplete={(score, total) => handleQuizComplete(module.id, score, total)}
                                onSkip={() => handleQuizSkip(module.id)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
