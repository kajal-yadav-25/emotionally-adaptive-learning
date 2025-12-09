import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMood } from '@/contexts/MoodContext';
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
  X,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface LearningModule {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
  videoId?: string;
  articleContent?: string;
  articleUrl?: string;
}

// Curated YouTube video IDs for different topics
const getCuratedVideoId = (topic: string, moduleType: string): string => {
  const topicLower = topic.toLowerCase();
  
  const videoMap: Record<string, Record<string, string>> = {
    'react': {
      'introduction': 'Tn6-PIqc4UM',
      'setup': 'CgkZ7MvWUAA',
      'project': 'b9eMGE7QtTk',
      'advanced': 'TNhaISOUy6Q'
    },
    'react.js': {
      'introduction': 'Tn6-PIqc4UM',
      'setup': 'CgkZ7MvWUAA',
      'project': 'b9eMGE7QtTk',
      'advanced': 'TNhaISOUy6Q'
    },
    'javascript': {
      'introduction': 'W6NZfCO5SIk',
      'setup': 'PkZNo7MFNFg',
      'project': 'jS4aFq5-91M',
      'advanced': 'Bv_5Zv5c-Ts'
    },
    'python': {
      'introduction': '_uQrJ0TkZlc',
      'setup': 'rfscVS0vtbw',
      'project': 'XGf2GcyHPhc',
      'advanced': 'HGOBQPFzWKo'
    },
    'web development': {
      'introduction': 'G3e-cpL7ofc',
      'setup': 'ZxKM3DCV2kE',
      'project': 'mU6anWqZJcc',
      'advanced': 'sBws8MSXN7A'
    },
    'data structures': {
      'introduction': '8hly31xKli0',
      'setup': 'RBSGKlAvoiM',
      'project': 'zg9ih6SVACc',
      'advanced': 'B31LgI4Y4DQ'
    },
    'machine learning': {
      'introduction': 'KNAWp2S3w94',
      'setup': 'i_LwzRVP7bg',
      'project': 'NWONeJKn6kc',
      'advanced': 'Gv9_4yMHFhI'
    }
  };

  // Find matching topic
  for (const [key, videos] of Object.entries(videoMap)) {
    if (topicLower.includes(key)) {
      return videos[moduleType] || videos['introduction'];
    }
  }
  
  // Default videos for unknown topics
  const defaultVideos: Record<string, string> = {
    'introduction': 'dQw4w9WgXcQ',
    'setup': 'dQw4w9WgXcQ',
    'project': 'dQw4w9WgXcQ',
    'advanced': 'dQw4w9WgXcQ'
  };
  
  return defaultVideos[moduleType] || 'dQw4w9WgXcQ';
};

// Generate article content for different modules
const getArticleContent = (topic: string, moduleTitle: string): string => {
  if (moduleTitle.includes('Core Concepts')) {
    return `
# Core Concepts of ${topic}

## Overview
Understanding the fundamental concepts is crucial for mastering ${topic}. This guide will walk you through the essential building blocks.

## Key Principles

### 1. Foundation
Every journey in ${topic} starts with understanding its core philosophy. The main idea is to break complex problems into smaller, manageable pieces.

### 2. Building Blocks
- **Components**: The basic units that make up any ${topic} application
- **State Management**: How data flows and changes over time
- **Patterns**: Common approaches to solving recurring problems

### 3. Best Practices
1. Start simple and iterate
2. Write clean, readable code
3. Test your implementations
4. Document your work

## Getting Started
Begin by setting up your development environment and creating your first simple project. Practice is key to mastering these concepts.

## Resources
- Official documentation
- Community forums
- Practice exercises
- Video tutorials

## Next Steps
Once you've grasped these concepts, move on to building your first project to apply what you've learned.
    `;
  }
  
  if (moduleTitle.includes('Best Practices')) {
    return `
# Best Practices & Patterns for ${topic}

## Introduction
Following best practices ensures your code is maintainable, scalable, and efficient.

## Design Patterns

### 1. Modular Design
Break your application into independent, reusable modules. This makes testing easier and improves code organization.

### 2. DRY Principle
Don't Repeat Yourself. Extract common functionality into reusable functions or components.

### 3. SOLID Principles
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

## Code Quality

### Naming Conventions
- Use descriptive, meaningful names
- Follow consistent naming patterns
- Avoid abbreviations unless widely understood

### Documentation
- Comment complex logic
- Write clear function descriptions
- Maintain up-to-date README files

## Performance Tips
1. Optimize critical paths
2. Use caching strategically
3. Profile before optimizing
4. Measure improvements

## Testing Strategy
- Unit tests for individual components
- Integration tests for workflows
- End-to-end tests for critical paths

## Conclusion
Adopting these practices from the start will save you time and headaches in the long run.
    `;
  }
  
  return `
# ${moduleTitle}

## Introduction
Welcome to this comprehensive guide on ${moduleTitle}. This article will help you understand the key concepts and practical applications.

## Key Topics

### Understanding the Basics
Before diving deep, it's important to establish a solid foundation. Take your time to understand each concept thoroughly.

### Practical Applications
Theory is important, but practice makes perfect. Try implementing what you learn in small projects.

### Common Challenges
- Learning curve can be steep initially
- Understanding when to apply different techniques
- Keeping up with updates and changes

## Step-by-Step Guide

1. **Start Small**: Begin with simple examples
2. **Build Up**: Gradually increase complexity
3. **Practice**: Apply concepts in real projects
4. **Review**: Regularly revisit and reinforce learning

## Tips for Success
- Take notes while learning
- Join community discussions
- Work on personal projects
- Teach others what you learn

## Summary
Mastering ${topic} takes time and dedication. Stay consistent with your learning and don't be afraid to make mistakes – they're part of the journey.

## Further Reading
Explore official documentation and community resources for more in-depth information.
  `;
};

const generateModules = (topic: string): LearningModule[] => {
  return [
    { 
      id: 1, 
      title: `Introduction to ${topic}`, 
      type: 'video', 
      duration: '15 min', 
      completed: false,
      videoId: getCuratedVideoId(topic, 'introduction')
    },
    { 
      id: 2, 
      title: `Core Concepts of ${topic}`, 
      type: 'article', 
      duration: '10 min', 
      completed: false,
      articleContent: getArticleContent(topic, `Core Concepts of ${topic}`)
    },
    { 
      id: 3, 
      title: `Setting Up Your ${topic} Environment`, 
      type: 'video', 
      duration: '20 min', 
      completed: false,
      videoId: getCuratedVideoId(topic, 'setup')
    },
    { 
      id: 4, 
      title: 'Knowledge Check', 
      type: 'quiz', 
      duration: '5 min', 
      completed: false 
    },
    { 
      id: 5, 
      title: `Building Your First ${topic} Project`, 
      type: 'video', 
      duration: '30 min', 
      completed: false,
      videoId: getCuratedVideoId(topic, 'project')
    },
    { 
      id: 6, 
      title: 'Best Practices & Patterns', 
      type: 'article', 
      duration: '15 min', 
      completed: false,
      articleContent: getArticleContent(topic, 'Best Practices & Patterns')
    },
    { 
      id: 7, 
      title: 'Advanced Techniques', 
      type: 'video', 
      duration: '25 min', 
      completed: false,
      videoId: getCuratedVideoId(topic, 'advanced')
    },
    { 
      id: 8, 
      title: 'Final Assessment', 
      type: 'quiz', 
      duration: '15 min', 
      completed: false 
    },
  ];
};

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
  
  const [pathId, setPathId] = useState<string | null>(pathData?.pathId || null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    if (pathData) {
      const generatedModules = generateModules(pathData.topic);
      
      // Check if this is an existing path
      if (pathData.pathId) {
        const existingPath = getPathById(pathData.pathId);
        if (existingPath) {
          // Restore completed status
          const modulesWithCompletion = generatedModules.map(m => ({
            ...m,
            completed: existingPath.completedModules.some(cm => cm.id === m.id)
          }));
          setModules(modulesWithCompletion);
          setPathId(pathData.pathId);
          return;
        }
      }
      
      // Create new path
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

  const toggleExpand = (moduleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
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
                <div 
                  className="p-6 flex items-center gap-4 cursor-pointer"
                  onClick={() => toggleComplete(module)}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0',
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
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-semibold transition-all truncate',
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
                  <div className="flex items-center gap-2 shrink-0">
                    {hasResource && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => toggleExpand(module.id, e)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            {module.type === 'video' ? <Play className="w-4 h-4 mr-1" /> : <FileText className="w-4 h-4 mr-1" />}
                            {module.type === 'video' ? 'Watch' : 'Read'}
                          </>
                        )}
                      </Button>
                    )}
                    <Button 
                      variant={module.completed ? 'ghost' : 'mood'} 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(module);
                      }}
                    >
                      {module.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start
                        </>
                      )}
                    </Button>
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
                        {module.type === 'video' && module.videoId && (
                          <div className="rounded-xl overflow-hidden bg-black aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${module.videoId}?rel=0`}
                              title={module.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        )}
                        
                        {module.type === 'article' && module.articleContent && (
                          <div className="bg-card/50 rounded-xl p-6 max-h-[500px] overflow-y-auto prose prose-invert prose-sm max-w-none">
                            <div className="space-y-4">
                              {module.articleContent.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) {
                                  return <h1 key={i} className="text-2xl font-bold text-foreground mt-4 mb-2">{line.replace('# ', '')}</h1>;
                                } else if (line.startsWith('## ')) {
                                  return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-2">{line.replace('## ', '')}</h2>;
                                } else if (line.startsWith('### ')) {
                                  return <h3 key={i} className="text-lg font-medium text-foreground mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                } else if (line.startsWith('- **')) {
                                  const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                                  if (match) {
                                    return (
                                      <div key={i} className="flex gap-2 text-muted-foreground ml-4">
                                        <span className="text-primary">•</span>
                                        <span><strong className="text-foreground">{match[1]}</strong>: {match[2]}</span>
                                      </div>
                                    );
                                  }
                                  return <p key={i} className="text-muted-foreground ml-4">{line.replace('- ', '• ')}</p>;
                                } else if (line.startsWith('- ')) {
                                  return <p key={i} className="text-muted-foreground ml-4 flex gap-2"><span className="text-primary">•</span>{line.replace('- ', '')}</p>;
                                } else if (line.match(/^\d+\./)) {
                                  return <p key={i} className="text-muted-foreground ml-4">{line}</p>;
                                } else if (line.trim()) {
                                  return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
                                }
                                return null;
                              })}
                            </div>
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
