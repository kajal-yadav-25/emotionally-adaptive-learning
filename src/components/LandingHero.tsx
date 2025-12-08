import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '@/contexts/MoodContext';
import { MoodSelector } from './MoodSelector';

export function LandingHero() {
  const navigate = useNavigate();
  const { moodColors } = useMood();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${moodColors.gradient} rounded-full blur-3xl opacity-20 animate-float`} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r ${moodColors.gradient} rounded-full blur-3xl opacity-15 animate-float`} style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Adaptive Learning</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Learn with Your{' '}
            <span className={`bg-gradient-to-r ${moodColors.gradient} bg-clip-text text-transparent`}>
              Emotions
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Experience personalized learning paths that adapt to your mood, 
            energy levels, and emotional state for maximum retention.
          </motion.p>

          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <p className="text-sm text-muted-foreground mb-4">How are you feeling right now?</p>
            <MoodSelector />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/create-path')}
              className="group"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Create Learning Path
            </Button>
            <Button variant="glass" size="xl">
              Learn More
            </Button>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Brain, title: 'Emotion Detection', desc: 'AI understands your current state' },
              { icon: Zap, title: 'Adaptive Content', desc: 'Content adjusts to your energy' },
              { icon: Heart, title: 'Personalized Pace', desc: 'Learn at your natural rhythm' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-left hover:border-primary/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
