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
  Sparkles,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ContentFormat = 'videos' | 'articles' | 'mixed';

interface LearningPathData {
  topic: string;
  mood: MoodType;
  speed: string;
  format: ContentFormat;
  goal: string;
}

const steps = [
  { id: 'topic', title: 'Topic', icon: Book },
  { id: 'mood', title: 'Emotional State', icon: Brain },
  { id: 'format', title: 'Format', icon: Video },
];

const formatOptions = [
  { value: 'videos', label: 'Videos', desc: 'Visual learning content', icon: Video },
  { value: 'articles', label: 'Articles', desc: 'Text-based learning', icon: FileText },
  { value: 'mixed', label: 'Mixed', desc: 'Best of both worlds', icon: Sparkles },
];

// Floating particle component - dynamically adapts to mood
function FloatingParticles({ mood }: { mood: MoodType }) {
  const config = moodConfig[mood];
  const particleColorMap: Record<MoodType, string> = {
    energetic: 'bg-orange-400',
    calm: 'bg-blue-400',
    focused: 'bg-green-400',
    creative: 'bg-purple-400',
    motivated: 'bg-rose-400',
    sad: 'bg-slate-400',
    anxious: 'bg-amber-400',
    bored: 'bg-teal-300',
    unmotivated: 'bg-red-800',
    curious: 'bg-yellow-400',
  };

  const particleShape = ['sad', 'unmotivated', 'bored'].includes(mood) 
    ? 'rounded-full opacity-20' 
    : ['anxious'].includes(mood)
      ? 'rounded-sm opacity-50 rotate-45'
      : ['creative', 'curious'].includes(mood)
        ? 'rounded-full opacity-60'
        : 'rounded-full opacity-40';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: config.particleCount }).map((_, i) => (
        <motion.div
          key={`${mood}-${i}`}
          className={cn(
            'absolute w-1.5 h-1.5',
            particleShape,
            particleColorMap[mood],
          )}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [Math.random() * 400, Math.random() * 800, Math.random() * 400],
            y: [Math.random() * 300, Math.random() * 600, Math.random() * 300],
            opacity: config.animationIntensity === 'high' 
              ? [0.3, 0.7, 0.3] 
              : config.animationIntensity === 'medium' 
                ? [0.2, 0.5, 0.2] 
                : [0.1, 0.25, 0.1],
            scale: config.animationIntensity === 'high'
              ? [0.5, 1.5, 0.5]
              : [0.5, 1, 0.5],
          }}
          transition={{
            duration: config.particleSpeed + Math.random() * 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

// Background pattern component based on mood
function MoodBackground({ mood }: { mood: MoodType }) {
  const config = moodConfig[mood];
  
  if (config.bgPattern === 'grid') {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
    );
  }
  if (config.bgPattern === 'dots') {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
    );
  }
  if (config.bgPattern === 'waves') {
    return (
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ background: 'repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 12px)' }}
        animate={{ backgroundPosition: ['0px 0px', '24px 24px'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    );
  }
  return null;
}

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
      navigate('/learning-path', { 
        state: { 
          ...data, 
          goal: `Learn ${data.topic}`,
        } 
      });
    }, 2000);
  };

  const moods = Object.entries(moodConfig) as [MoodType, typeof moodColors][];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingParticles mood={data.mood} />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${moodColors.gradient} rounded-full blur-3xl`}
          animate={{
            opacity: moodColors.animationIntensity === 'high' ? [0.2, 0.4, 0.2] : [0.08, 0.18, 0.08],
            scale: moodColors.animationIntensity === 'high' ? [1, 1.3, 1] : [1, 1.1, 1],
            rotate: moodColors.animationIntensity === 'low' ? [0, 90, 0] : [0, 180, 360],
          }}
          transition={{ 
            duration: moodColors.animationIntensity === 'high' ? 8 : 16, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div
          className={`absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-l ${moodColors.gradient} rounded-full blur-3xl`}
          animate={{
            opacity: moodColors.animationIntensity === 'high' ? [0.15, 0.3, 0.15] : [0.05, 0.12, 0.05],
            scale: [1.1, 0.9, 1.1],
            x: moodColors.animationIntensity === 'high' ? [-30, 30, -30] : [-10, 10, -10],
          }}
          transition={{ 
            duration: moodColors.animationIntensity === 'high' ? 7 : 14, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <MoodBackground mood={data.mood} />
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
              <motion.div
                key={step.id}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentStep 
                    ? `bg-gradient-to-r ${moodColors.gradient}` 
                    : index < currentStep 
                      ? 'bg-primary/60' 
                      : 'bg-muted'
                )}
                animate={index === currentStep ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                    index === currentStep 
                      ? `bg-gradient-to-br ${moodColors.gradient} shadow-lg ${moodColors.glow}` 
                      : index < currentStep 
                        ? 'bg-primary/30' 
                        : 'bg-muted/50'
                  )}
                  animate={index === currentStep ? {
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 20px rgba(255,255,255,0.15)',
                      '0 0 0px rgba(255,255,255,0)',
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {index < currentStep ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                      <CheckCircle2 className="w-5 h-5 text-foreground" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-5 h-5 text-foreground" />
                  )}
                </motion.div>
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
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
              {/* Animated border glow */}
              <motion.div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${moodColors.gradient} opacity-0`}
                animate={{ opacity: [0, 0.08, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ zIndex: -1 }}
              />

              {/* Step 0: Topic */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Book className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <h2 className="font-display text-3xl font-bold mb-2">What do you want to learn?</h2>
                    <p className="text-muted-foreground">Enter a topic you're interested in mastering</p>
                  </div>
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <Input
                      value={data.topic}
                      onChange={(e) => setData({ ...data, topic: e.target.value })}
                      placeholder="e.g. React.js, Data Structures, Machine Learning..."
                      className="h-14 text-lg bg-background/50 border-border/50 text-center"
                    />
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['React.js', 'Python', 'Web Development', 'Data Science'].map((suggestion, i) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setData({ ...data, topic: suggestion })}
                        className="px-4 py-2 rounded-full bg-secondary/50 text-sm hover:bg-secondary transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Mood (manual selection only, no emojis, no descriptions) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <h2 className="font-display text-3xl font-bold mb-2">How are you feeling?</h2>
                    <p className="text-muted-foreground">Select your current mood</p>
                  </div>

                  {/* Mood Grid - no emojis, no descriptions */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {moods.map(([moodType, config], i) => (
                      <motion.button
                        key={moodType}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setMood(moodType);
                          setData({ ...data, mood: moodType });
                        }}
                        className={cn(
                          'p-4 rounded-2xl border transition-all duration-300 text-center relative overflow-hidden',
                          data.mood === moodType
                            ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg ${config.glow}`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        {data.mood === moodType && (
                          <motion.div
                            className="absolute inset-0 bg-white/10"
                            animate={{ opacity: [0, 0.15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        <span className="font-semibold block">{config.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Format */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Video className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <h2 className="font-display text-3xl font-bold mb-2">Content Format</h2>
                    <p className="text-muted-foreground">How do you prefer to consume content?</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {formatOptions.map((option, i) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ scale: 1.06, y: -6 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setData({ ...data, format: option.value as ContentFormat })}
                        className={cn(
                          'p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-300 relative overflow-hidden',
                          data.format === option.value
                            ? `bg-gradient-to-br ${moodColors.gradient} border-transparent shadow-lg`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        {data.format === option.value && (
                          <motion.div
                            className="absolute inset-0 bg-white/5"
                            animate={{ opacity: [0, 0.2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                        <option.icon className="w-8 h-8" />
                        <span className="font-semibold">{option.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{option.desc}</span>
                      </motion.button>
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
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
                        <CheckCircle2 className="w-4 h-4" />
                        Done
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
