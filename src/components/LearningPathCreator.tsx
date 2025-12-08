import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMood, MoodType, moodConfig } from '@/contexts/MoodContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Book, 
  Video, 
  FileText, 
  Zap, 
  Target,
  Gauge,
  Brain,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type LearningSpeed = 'slow' | 'moderate' | 'fast';
type ContentFormat = 'videos' | 'articles' | 'mixed';

interface LearningPathData {
  topic: string;
  mood: MoodType;
  speed: LearningSpeed;
  format: ContentFormat;
  goal: string;
}

const steps = [
  { id: 'topic', title: 'Topic of Interest', icon: Book },
  { id: 'mood', title: 'Emotional State', icon: Brain },
  { id: 'speed', title: 'Learning Speed', icon: Gauge },
  { id: 'format', title: 'Preferred Format', icon: Video },
  { id: 'goal', title: 'Learning Goal', icon: Target },
];

const speedOptions = [
  { value: 'slow', label: 'Relaxed', desc: 'Take your time, deep understanding', icon: '🐢' },
  { value: 'moderate', label: 'Balanced', desc: 'Steady progress, good retention', icon: '🚶' },
  { value: 'fast', label: 'Intensive', desc: 'Quick learning, high focus', icon: '🚀' },
];

const formatOptions = [
  { value: 'videos', label: 'Videos', desc: 'Visual learning content', icon: Video },
  { value: 'articles', label: 'Articles', desc: 'Text-based learning', icon: FileText },
  { value: 'mixed', label: 'Mixed', desc: 'Best of both worlds', icon: Sparkles },
];

export function LearningPathCreator() {
  const navigate = useNavigate();
  const { mood, setMood, moodColors } = useMood();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<LearningPathData>({
    topic: '',
    mood: mood,
    speed: 'moderate',
    format: 'mixed',
    goal: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.topic.length > 2;
      case 1: return true;
      case 2: return true;
      case 3: return true;
      case 4: return data.goal.length > 5;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      toast.success('Learning path created!', {
        description: `Your personalized ${data.topic} learning path is ready.`
      });
      setIsGenerating(false);
      navigate('/learning-path', { state: data });
    }, 2000);
  };

  const moods = Object.entries(moodConfig) as [MoodType, typeof moodColors][];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${moodColors.gradient} rounded-full blur-3xl opacity-20 animate-float`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentStep 
                    ? `bg-gradient-to-r ${moodColors.gradient} scale-125` 
                    : index < currentStep 
                      ? 'bg-primary/60' 
                      : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                    index === currentStep 
                      ? `bg-gradient-to-br ${moodColors.gradient} shadow-lg ${moodColors.glow}` 
                      : index < currentStep 
                        ? 'bg-primary/30' 
                        : 'bg-muted/50'
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-foreground" />
                  ) : (
                    <step.icon className="w-5 h-5 text-foreground" />
                  )}
                </div>
                <span className={cn(
                  'text-xs mt-2 hidden md:block',
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-3xl p-8 md:p-12"
            >
              {/* Step 0: Topic */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Book className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">What do you want to learn?</h2>
                    <p className="text-muted-foreground">Enter a topic you're interested in mastering</p>
                  </div>
                  <Input
                    value={data.topic}
                    onChange={(e) => setData({ ...data, topic: e.target.value })}
                    placeholder="e.g. React.js, Data Structures, Machine Learning..."
                    className="h-14 text-lg bg-background/50 border-border/50 text-center"
                  />
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['React.js', 'Python', 'Web Development', 'Data Science'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setData({ ...data, topic: suggestion })}
                        className="px-4 py-2 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Mood */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Brain className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">How are you feeling?</h2>
                    <p className="text-muted-foreground">Your current emotional state helps us personalize content</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {moods.map(([moodType, config]) => (
                      <motion.button
                        key={moodType}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setMood(moodType);
                          setData({ ...data, mood: moodType });
                        }}
                        className={cn(
                          'p-4 rounded-2xl border transition-all duration-300 text-left',
                          data.mood === moodType
                            ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg ${config.glow}`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        <span className="text-3xl mb-2 block">{config.emoji}</span>
                        <span className="font-semibold block">{config.label}</span>
                        <span className="text-xs text-muted-foreground">{config.description}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Speed */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Gauge className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">Learning Speed</h2>
                    <p className="text-muted-foreground">Choose a pace that matches your availability</p>
                  </div>
                  <div className="space-y-3">
                    {speedOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setData({ ...data, speed: option.value as LearningSpeed })}
                        className={cn(
                          'w-full p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 text-left',
                          data.speed === option.value
                            ? `bg-gradient-to-r ${moodColors.gradient} border-transparent shadow-lg`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        <span className="text-3xl">{option.icon}</span>
                        <div>
                          <span className="font-semibold block">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.desc}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Format */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Video className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">Content Format</h2>
                    <p className="text-muted-foreground">How do you prefer to consume content?</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {formatOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setData({ ...data, format: option.value as ContentFormat })}
                        className={cn(
                          'p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300',
                          data.format === option.value
                            ? `bg-gradient-to-br ${moodColors.gradient} border-transparent shadow-lg`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        <option.icon className="w-8 h-8" />
                        <span className="font-semibold">{option.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{option.desc}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Goal */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <Target className="w-8 h-8 text-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">What's your goal?</h2>
                    <p className="text-muted-foreground">Define what success looks like for you</p>
                  </div>
                  <Input
                    value={data.goal}
                    onChange={(e) => setData({ ...data, goal: e.target.value })}
                    placeholder="e.g. Build a full-stack web application..."
                    className="h-14 text-lg bg-background/50 border-border/50 text-center"
                  />
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      'Get a job as a developer',
                      'Build personal projects',
                      'Learn for fun',
                      'Career transition'
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setData({ ...data, goal: suggestion })}
                        className="px-4 py-2 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  variant="mood" 
                  onClick={handleNext}
                  disabled={!canProceed() || isGenerating}
                  className="min-w-32"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate Path
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
