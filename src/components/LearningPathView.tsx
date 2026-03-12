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
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ModuleQuiz } from '@/components/ModuleQuiz';

interface LearningModule {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  completed: boolean;
  searchQuery?: string;
  articleContent?: string;
}

// Generate YouTube search query based on topic and module type
const getVideoSearchQuery = (topic: string, moduleType: string): string => {
  const queries: Record<string, string> = {
    'introduction': `${topic} tutorial for beginners introduction`,
    'setup': `${topic} setup installation tutorial`,
    'project': `${topic} project tutorial build`,
    'advanced': `${topic} advanced tutorial tips`
  };
  return queries[moduleType] || `${topic} tutorial`;
};

// Generate comprehensive article content based on topic
const generateArticleContent = (topic: string, moduleTitle: string): string => {
  const topicCapitalized = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  if (moduleTitle.includes('Core Concepts')) {
    return `
# Core Concepts of ${topicCapitalized}

## Overview
Understanding the fundamental concepts is crucial for mastering ${topicCapitalized}. This comprehensive guide will walk you through the essential building blocks that form the foundation of ${topicCapitalized}.

## What is ${topicCapitalized}?
${topicCapitalized} is a powerful technology/concept that enables developers and learners to build efficient solutions. At its core, it focuses on providing a structured approach to problem-solving.

## Key Principles

### 1. Foundational Understanding
Every journey in ${topicCapitalized} starts with understanding its core philosophy:
- **Modularity**: Breaking complex problems into smaller, manageable pieces
- **Abstraction**: Hiding complexity behind simple interfaces
- **Reusability**: Creating components that can be used multiple times

### 2. Core Building Blocks
The main components that make up ${topicCapitalized} include:
- **Components/Modules**: The basic units that form the structure
- **State/Data**: How information is stored and managed
- **Logic/Functions**: The operations that transform data
- **Interfaces**: How different parts communicate

### 3. Design Patterns
Common patterns used in ${topicCapitalized}:
- **Observer Pattern**: Watching for changes and reacting
- **Factory Pattern**: Creating objects in a structured way
- **Singleton Pattern**: Ensuring single instances when needed

## Getting Started Checklist
1. ✅ Set up your development environment
2. ✅ Understand the basic terminology
3. ✅ Write your first simple example
4. ✅ Explore official documentation
5. ✅ Join community forums

## Common Terminology
| Term | Definition |
|------|------------|
| API | Application Programming Interface - how components interact |
| Framework | A structure that provides ready-made components |
| Library | A collection of pre-written code |
| Runtime | The environment where code executes |

## Next Steps
Once you've grasped these concepts, move on to setting up your environment and building your first project. Remember: practice is key to mastery!

## Resources for Learning ${topicCapitalized}
- Official Documentation
- Online Tutorials and Courses
- Community Forums and Discord
- GitHub Repositories with Examples
- YouTube Tutorial Channels
    `;
  }
  
  if (moduleTitle.includes('Best Practices')) {
    return `
# Best Practices & Patterns for ${topicCapitalized}

## Introduction
Following best practices ensures your ${topicCapitalized} code is maintainable, scalable, and efficient. This guide covers industry-standard patterns that professional developers use.

## Code Organization

### Project Structure
Organize your ${topicCapitalized} project with clear separation:
\`\`\`
project/
├── src/
│   ├── components/    # Reusable pieces
│   ├── utils/         # Helper functions
│   ├── services/      # External integrations
│   └── types/         # Type definitions
├── tests/             # Test files
└── docs/              # Documentation
\`\`\`

### Naming Conventions
- **Variables**: Use descriptive camelCase names (\`userName\`, \`itemCount\`)
- **Constants**: Use UPPER_SNAKE_CASE (\`MAX_RETRIES\`, \`API_URL\`)
- **Functions**: Use verb phrases (\`getUserData\`, \`calculateTotal\`)
- **Classes**: Use PascalCase (\`UserService\`, \`DataProcessor\`)

## Design Principles

### SOLID Principles
1. **Single Responsibility**: Each module does one thing well
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable
4. **Interface Segregation**: Many specific interfaces over one general
5. **Dependency Inversion**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
Extract common functionality:
- Create utility functions for repeated operations
- Build reusable components
- Use configuration files for constants

### KISS (Keep It Simple)
- Avoid over-engineering
- Write readable code over clever code
- Refactor when complexity grows

## Performance Best Practices

### Optimization Guidelines
1. **Measure First**: Profile before optimizing
2. **Cache Strategically**: Store expensive computations
3. **Lazy Load**: Load resources only when needed
4. **Minimize Dependencies**: Keep bundle sizes small

### Common Performance Pitfalls
- ❌ Premature optimization
- ❌ Unnecessary re-renders/recalculations
- ❌ Memory leaks from uncleared resources
- ❌ Blocking operations on main thread

## Testing Strategy

### Test Pyramid
\`\`\`
        /\\
       /  \\  E2E Tests (few)
      /----\\
     /      \\  Integration Tests (some)
    /--------\\
   /          \\  Unit Tests (many)
  --------------
\`\`\`

### What to Test
- ✅ Business logic and calculations
- ✅ Edge cases and error handling
- ✅ User interactions and workflows
- ✅ API integrations

## Documentation
- Write clear README files
- Add inline comments for complex logic
- Maintain API documentation
- Include usage examples

## Security Considerations
- Validate all inputs
- Sanitize data before display
- Use secure authentication methods
- Keep dependencies updated

## Conclusion
Adopting these practices from the start will make your ${topicCapitalized} projects more professional and maintainable. Remember: good code is not just about making it work, but making it last.
    `;
  }
  
  return `
# ${moduleTitle}

## Introduction
Welcome to this comprehensive guide on ${moduleTitle}. This article will help you understand the key concepts and practical applications related to ${topicCapitalized}.

## Learning Objectives
By the end of this module, you will:
- Understand the fundamental concepts of ${moduleTitle.toLowerCase()}
- Be able to apply these concepts in practical scenarios
- Know the common patterns and best practices
- Have hands-on experience through examples

## Key Concepts

### Understanding the Basics
Before diving deep into ${topicCapitalized}, it's important to establish a solid foundation. Here are the core concepts you need to grasp:

1. **Fundamentals**: The building blocks that everything else is built upon
2. **Syntax & Structure**: How to write and organize your code
3. **Common Operations**: The most frequently used operations and functions
4. **Error Handling**: How to deal with problems gracefully

### Why ${topicCapitalized} Matters
In today's technology landscape, ${topicCapitalized} has become essential because:
- It solves real-world problems efficiently
- It has a large and supportive community
- It continues to evolve with new features
- It integrates well with other technologies

## Practical Examples

### Example 1: Getting Started
Start with the simplest possible example to understand the basics. Don't try to build complex projects immediately.

### Example 2: Building Blocks
Once comfortable with basics, start combining concepts to create more complex functionality.

### Example 3: Real-World Application
Apply what you've learned to solve actual problems you encounter.

## Step-by-Step Guide

### Step 1: Environment Setup
Make sure your development environment is properly configured with all necessary tools and dependencies.

### Step 2: Basic Implementation
Create a simple implementation that demonstrates core concepts.

### Step 3: Testing & Validation
Verify that your implementation works correctly with various inputs.

### Step 4: Refinement
Improve your code based on feedback and new learnings.

## Common Mistakes to Avoid
- ❌ Skipping fundamentals to learn advanced topics
- ❌ Not practicing regularly
- ❌ Ignoring error messages
- ❌ Copy-pasting without understanding
- ❌ Working in isolation without community support

## Tips for Success
- ✅ Take notes while learning
- ✅ Build small projects to reinforce concepts
- ✅ Join online communities and forums
- ✅ Read official documentation
- ✅ Teach others what you learn

## Summary
Mastering ${topicCapitalized} takes time and dedication. Stay consistent with your learning, practice regularly, and don't be afraid to make mistakes – they're part of the journey.

## Additional Resources
- Official ${topicCapitalized} Documentation
- Community Forums and Discord Servers
- YouTube Tutorial Channels
- Interactive Coding Platforms
- Open Source Projects to Study

## What's Next?
Continue to the next module to build upon what you've learned here. Remember to practice each concept before moving forward!
  `;
};

const generateModules = (topic: string, format: string = 'mixed'): LearningModule[] => {
  const allModules: LearningModule[] = [
    { 
      id: 1, 
      title: `Introduction to ${topic}`, 
      type: 'video', 
      duration: '15 min', 
      completed: false,
      searchQuery: getVideoSearchQuery(topic, 'introduction')
    },
    { 
      id: 2, 
      title: `Core Concepts of ${topic}`, 
      type: 'article', 
      duration: '10 min', 
      completed: false,
      articleContent: generateArticleContent(topic, `Core Concepts of ${topic}`)
    },
    { 
      id: 3, 
      title: `Setting Up Your ${topic} Environment`, 
      type: 'video', 
      duration: '20 min', 
      completed: false,
      searchQuery: getVideoSearchQuery(topic, 'setup')
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
      searchQuery: getVideoSearchQuery(topic, 'project')
    },
    { 
      id: 6, 
      title: `Best Practices & Patterns for ${topic}`, 
      type: 'article', 
      duration: '15 min', 
      completed: false,
      articleContent: generateArticleContent(topic, 'Best Practices & Patterns')
    },
    { 
      id: 7, 
      title: `Advanced ${topic} Techniques`, 
      type: 'video', 
      duration: '25 min', 
      completed: false,
      searchQuery: getVideoSearchQuery(topic, 'advanced')
    },
    { 
      id: 8, 
      title: 'Final Assessment', 
      type: 'quiz', 
      duration: '15 min', 
      completed: false 
    },
  ];

  if (format === 'videos') {
    // Replace articles with video modules
    return allModules.map((m, i) => {
      if (m.type === 'article') {
        const videoTopics = [
          { title: `Deep Dive into ${topic} Concepts`, queryType: 'introduction' },
          { title: `${topic} Tips & Tricks`, queryType: 'advanced' },
        ];
        const replacement = videoTopics[i % videoTopics.length];
        return {
          ...m,
          type: 'video' as const,
          title: replacement.title,
          searchQuery: getVideoSearchQuery(topic, replacement.queryType),
          articleContent: undefined,
        };
      }
      return m;
    });
  }

  if (format === 'articles') {
    // Replace videos with article modules
    return allModules.map((m) => {
      if (m.type === 'video') {
        return {
          ...m,
          type: 'article' as const,
          title: m.title,
          articleContent: generateArticleContent(topic, m.title),
          searchQuery: undefined,
        };
      }
      return m;
    });
  }

  // 'mixed' — return as-is
  return allModules;
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
    suggestedDifficulty?: string | null;
    emotionSource?: string | null;
    detectedConfidence?: number | null;
  } | null;
  
  const [pathId, setPathId] = useState<string | null>(pathData?.pathId || null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [quizActiveFor, setQuizActiveFor] = useState<number | null>(null);
  const [quizCompletedFor, setQuizCompletedFor] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (pathData) {
      const generatedModules = generateModules(pathData.topic, pathData.format);
      
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
              {/* Mood & Difficulty Indicator */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {pathData.mood && moodConfig[pathData.mood as MoodType] && (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${moodConfig[pathData.mood as MoodType].gradient} text-foreground`}>
                    <Brain className="w-3.5 h-3.5" />
                    {moodConfig[pathData.mood as MoodType].label}
                  </span>
                )}
                {pathData.suggestedDifficulty && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary/60 text-foreground capitalize">
                    Difficulty: {pathData.suggestedDifficulty}
                  </span>
                )}
                {pathData.emotionSource && (
                  <span className="text-xs text-muted-foreground">
                    via {pathData.emotionSource === 'face' ? 'camera' : 'voice'} detection
                    {pathData.detectedConfidence ? ` (${Math.round(pathData.detectedConfidence * 100)}%)` : ''}
                  </span>
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
