import { useState, useRef, useEffect, useCallback } from 'react';
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
  Gauge,
  Brain,
  Sparkles,
  CheckCircle2,
  Camera,
  CameraOff,
  Mic,
  MicOff
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
  { id: 'topic', title: 'Topic', icon: Book },
  { id: 'mood', title: 'Emotional State', icon: Brain },
  { id: 'speed', title: 'Speed', icon: Gauge },
  { id: 'format', title: 'Format', icon: Video },
];

const speedOptions = [
  { value: 'slow', label: 'Relaxed', desc: 'Take your time, deep understanding', icon: Gauge, color: 'from-blue-400 to-cyan-400', animDuration: 4 },
  { value: 'moderate', label: 'Balanced', desc: 'Steady progress, good retention', icon: Zap, color: 'from-yellow-400 to-orange-400', animDuration: 2.5 },
  { value: 'fast', label: 'Intensive', desc: 'Quick learning, high focus', icon: ArrowRight, color: 'from-red-400 to-rose-500', animDuration: 1.2 },
];

const formatOptions = [
  { value: 'videos', label: 'Videos', desc: 'Visual learning content', icon: Video },
  { value: 'articles', label: 'Articles', desc: 'Text-based learning', icon: FileText },
  { value: 'mixed', label: 'Mixed', desc: 'Best of both worlds', icon: Sparkles },
];

// Floating particle component
function FloatingParticles({ mood }: { mood: MoodType }) {
  const config = moodConfig[mood];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute w-1.5 h-1.5 rounded-full opacity-40',
            mood === 'energetic' && 'bg-orange-400',
            mood === 'calm' && 'bg-blue-400',
            mood === 'focused' && 'bg-green-400',
            mood === 'creative' && 'bg-purple-400',
            mood === 'motivated' && 'bg-rose-400',
          )}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * 400,
              Math.random() * 800,
              Math.random() * 400,
            ],
            y: [
              Math.random() * 300,
              Math.random() * 600,
              Math.random() * 300,
            ],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
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

  // Camera & Mic state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraOn(false);
    setMicOn(false);
    setAudioLevel(0);
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stream]);

  const toggleCamera = async () => {
    if (cameraOn) {
      stopStream();
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: micOn 
      });
      setStream(mediaStream);
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success('Camera activated!', { description: 'We can see your expressions now.' });
    } catch {
      toast.error('Camera access denied', { description: 'Please allow camera access.' });
    }
  };

  const toggleMic = async () => {
    if (micOn) {
      if (stream) {
        stream.getAudioTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setMicOn(false);
      setAudioLevel(0);
      return;
    }
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Merge with existing video stream if camera is on
      if (stream && cameraOn) {
        audioStream.getAudioTracks().forEach(t => stream.addTrack(t));
      } else {
        setStream(audioStream);
      }
      setMicOn(true);

      // Audio level visualization
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(audioStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      toast.success('Microphone activated!', { description: 'Listening to your tone.' });
    } catch {
      toast.error('Microphone access denied');
    }
  };

  // Attach video when stream changes
  useEffect(() => {
    if (videoRef.current && stream && cameraOn) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraOn]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.topic.length > 2;
      case 1: return true;
      case 2: return true;
      case 3: return true;
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
    stopStream();
    setIsGenerating(true);
    setTimeout(() => {
      toast.success('Learning path created!', {
        description: `Your personalized ${data.topic} learning path is ready.`
      });
      setIsGenerating(false);
      navigate('/learning-path', { state: { ...data, goal: `Learn ${data.topic}` } });
    }, 2000);
  };

  const moods = Object.entries(moodConfig) as [MoodType, typeof moodColors][];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Particles */}
      <FloatingParticles mood={data.mood} />

      {/* Background Effects - enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${moodColors.gradient} rounded-full blur-3xl`}
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-l ${moodColors.gradient} rounded-full blur-3xl`}
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [1.1, 0.9, 1.1],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
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

              {/* Step 1: Mood + Camera/Mic */}
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
                    <p className="text-muted-foreground">Select your mood or let us detect it</p>
                  </div>

                  {/* Camera & Mic Module */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-4 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Emotion Detection</span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleCamera}
                          className={cn(
                            'p-2.5 rounded-xl transition-all duration-300',
                            cameraOn
                              ? `bg-gradient-to-br ${moodColors.gradient} shadow-lg`
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {cameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4 text-muted-foreground" />}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleMic}
                          className={cn(
                            'p-2.5 rounded-xl transition-all duration-300 relative',
                            micOn
                              ? `bg-gradient-to-br ${moodColors.gradient} shadow-lg`
                              : 'bg-secondary/50 hover:bg-secondary'
                          )}
                        >
                          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-muted-foreground" />}
                          {/* Audio level ring */}
                          {micOn && (
                            <motion.div
                              className={`absolute inset-0 rounded-xl border-2 border-primary`}
                              animate={{ scale: 1 + audioLevel * 0.4, opacity: audioLevel }}
                              transition={{ duration: 0.1 }}
                            />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Camera Preview */}
                    <AnimatePresence>
                      {cameraOn && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 180, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="relative rounded-xl overflow-hidden mb-3 bg-background/80"
                        >
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-xl mirror"
                            style={{ transform: 'scaleX(-1)' }}
                          />
                          {/* Scanning overlay */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent`}
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                          />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-foreground/80">Analyzing expressions...</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Audio Visualizer */}
                    <AnimatePresence>
                      {micOn && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 40, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex items-center gap-1 justify-center rounded-xl bg-background/50 px-4"
                        >
                          {Array.from({ length: 16 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className={`w-1 rounded-full bg-gradient-to-t ${moodColors.gradient}`}
                              animate={{
                                height: Math.max(4, audioLevel * 30 * (1 + Math.sin(i * 0.8) * 0.5)),
                              }}
                              transition={{ duration: 0.05 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!cameraOn && !micOn && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Enable camera or mic for AI emotion detection, or select manually below
                      </p>
                    )}
                  </motion.div>

                  {/* Mood Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                          'p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden',
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
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mx-auto mb-4`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Gauge className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <h2 className="font-display text-3xl font-bold mb-2">Learning Speed</h2>
                    <p className="text-muted-foreground">Choose a pace that matches your availability</p>
                  </div>
                  <div className="space-y-4">
                    {speedOptions.map((option, i) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.03, x: 10 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setData({ ...data, speed: option.value as LearningSpeed })}
                        className={cn(
                          'w-full p-5 rounded-2xl border flex items-center gap-5 transition-all duration-300 text-left relative overflow-hidden',
                          data.speed === option.value
                            ? `bg-gradient-to-r ${option.color} border-transparent shadow-lg`
                            : 'bg-secondary/30 border-border/50 hover:bg-secondary/50'
                        )}
                      >
                        {/* Animated pulse bg for selected */}
                        {data.speed === option.value && (
                          <motion.div
                            className="absolute inset-0 bg-white/10"
                            animate={{ opacity: [0, 0.15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        {/* Icon with speed-based animation */}
                        <motion.div
                          className={cn(
                            'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
                            data.speed === option.value
                              ? 'bg-white/20'
                              : `bg-gradient-to-br ${option.color} opacity-80`
                          )}
                          animate={data.speed === option.value ? { 
                            scale: [1, 1.15, 1],
                          } : {}}
                          transition={{ duration: option.animDuration, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <option.icon className="w-7 h-7 text-foreground" />
                        </motion.div>
                        <div className="flex-1">
                          <span className="font-semibold block text-lg">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.desc}</span>
                        </div>
                        {data.speed === option.value && (
                          <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-foreground/90" />
                          </motion.div>
                        )}
                        {/* Speed indicator bar */}
                        <motion.div
                          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${option.color}`}
                          initial={{ width: '0%' }}
                          animate={{ width: data.speed === option.value ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Format */}
              {currentStep === 3 && (
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
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
