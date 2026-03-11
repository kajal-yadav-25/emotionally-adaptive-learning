import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Zap, Heart, BookOpen, Target, TrendingUp, Shield, LogIn, LogOut, User, ArrowRight, Layers, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood, moodConfig, MoodType } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRef, useState, useEffect } from 'react';

function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentIndex, texts]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}

function OrbitingIcon({ icon: Icon, delay, radius, duration, gradient }: { icon: any; delay: number; radius: number; duration: number; gradient: string }) {
  return (
    <motion.div
      className={`absolute w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      style={{ left: '50%', top: '50%' }}
      animate={{
        x: [Math.cos(delay) * radius, Math.cos(delay + Math.PI) * radius, Math.cos(delay + Math.PI * 2) * radius],
        y: [Math.sin(delay) * radius, Math.sin(delay + Math.PI) * radius, Math.sin(delay + Math.PI * 2) * radius],
      }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <Icon className="w-5 h-5 text-foreground" />
    </motion.div>
  );
}

function MarqueeStrip() {
  const items = ['Emotion AI', '✦', 'Adaptive Learning', '✦', 'Real-time Detection', '✦', 'Personalized Paths', '✦', 'Progress Tracking', '✦', 'Smart Pacing', '✦'];
  return (
    <div className="overflow-hidden py-4 border-y border-border/30 bg-card/30 backdrop-blur-sm">
      <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`text-sm font-medium ${item === '✦' ? 'text-primary' : 'text-muted-foreground'}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LandingHero() {
  const navigate = useNavigate();
  const { moodColors } = useMood();
  const { user, signOut } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const moodPreviews: { mood: MoodType; x: number; y: number }[] = [
    { mood: 'energetic', x: -280, y: -120 },
    { mood: 'calm', x: 280, y: -80 },
    { mood: 'focused', x: -240, y: 100 },
    { mood: 'creative', x: 260, y: 120 },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Auth buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {user ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/progress')} className="glass-card border-none">
              <User className="w-4 h-4 mr-1" />
              {user.email?.split('@')[0]}
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="glass-card border-none">
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button variant="glass" size="sm" onClick={() => navigate('/auth')} className="group">
            <LogIn className="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform" />
            Sign In
          </Button>
        )}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-20 flex items-center gap-2"
      >
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}>
          <Brain className="w-5 h-5 text-foreground" />
        </div>
        <span className="font-display font-bold text-lg">MoodLearn</span>
      </motion.div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden noise-overlay">
        <motion.div
          className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r ${moodColors.gradient} rounded-full blur-[120px]`}
          animate={{ opacity: [0.12, 0.25, 0.12], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-l ${moodColors.gradient} rounded-full blur-[100px]`}
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/8 via-transparent to-transparent rounded-full" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating mood orbs */}
        <div className="hidden md:block">
          {moodPreviews.map(({ mood, x, y }) => (
            <motion.div
              key={mood}
              className="absolute left-1/2 top-1/2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.15, 0.35, 0.15],
                x: [x, x + 20, x],
                y: [y, y - 15, y],
              }}
              transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moodConfig[mood].gradient} blur-sm`} />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 glow-border"
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">AI-Powered Adaptive Learning</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95] tracking-tight"
          >
            Learn with Your
            <br />
            <TypewriterText
              texts={['Emotions', 'Energy', 'Curiosity', 'Passion']}
              className={`bg-gradient-to-r ${moodColors.gradient} bg-clip-text text-transparent`}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience personalized learning paths that adapt to your mood,
            energy levels, and emotional state for{' '}
            <span className="text-foreground font-medium">maximum retention</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/create-path')}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                Create Learning Path
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button variant="glass" size="xl" onClick={scrollToFeatures} className="group">
              <Layers className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Explore Features
            </Button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '10', label: 'Mood Modes', icon: Brain, color: 'from-orange-500 to-amber-400' },
              { value: 'AI', label: 'Emotion Detection', icon: Activity, color: 'from-blue-500 to-cyan-400' },
              { value: '3', label: 'Content Formats', icon: BookOpen, color: 'from-green-500 to-emerald-400' },
              { value: '100%', label: 'Personalized', icon: Target, color: 'from-purple-500 to-pink-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card-hover rounded-2xl p-5 text-center glow-border cursor-default"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-foreground" />
                </div>
                <p className="font-display text-2xl font-bold stat-number">{stat.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-20"
          >
            <h3 className="font-display text-2xl font-semibold mb-10 text-muted-foreground flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-border" />
              How It Works
              <div className="h-px w-12 bg-border" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector lines */}
              <div className="hidden md:block absolute top-12 left-[33%] right-[33%] h-px bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

              {[
                { icon: Heart, title: '1. Share Your Mood', desc: 'Tell us how you feel or let our AI detect your emotional state via camera & mic.', gradient: 'from-rose-500 to-pink-500' },
                { icon: Zap, title: '2. Get Adaptive Content', desc: 'Receive a personalized curriculum with videos, articles, or both — tuned to your energy.', gradient: 'from-amber-500 to-orange-500' },
                { icon: Shield, title: '3. Learn & Track', desc: 'Progress through modules at your own pace with real-time progress tracking.', gradient: 'from-emerald-500 to-green-500' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="glass-card-hover rounded-2xl p-7 text-left glow-border relative"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="relative z-10 mt-auto">
        <MarqueeStrip />
      </div>
    </section>
  );
}
