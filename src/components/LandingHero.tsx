import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Zap, Heart, BookOpen, Target, TrendingUp, Shield, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';

export function LandingHero() {
  const navigate = useNavigate();
  const { moodColors } = useMood();
  const { user, signOut } = useAuth();

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Auth buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {user ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/progress')}>
              <User className="w-4 h-4 mr-1" />
              {user.email?.split('@')[0]}
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button variant="glass" size="sm" onClick={() => navigate('/auth')}>
            <LogIn className="w-4 h-4 mr-1" />
            Sign In
          </Button>
        )}
      </div>

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
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Experience personalized learning paths that adapt to your mood, 
            energy levels, and emotional state for maximum retention.
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
              className="group"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Create Learning Path
            </Button>
            <Button variant="glass" size="xl" onClick={scrollToFeatures}>
              Learn More
            </Button>
          </motion.div>

          {/* About Section - Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '5', label: 'Mood Modes', icon: Brain },
              { value: '3', label: 'Learning Speeds', icon: TrendingUp },
              { value: '3', label: 'Content Formats', icon: BookOpen },
              { value: '100%', label: 'Personalized', icon: Target },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="glass-card rounded-2xl p-5 text-center hover:border-primary/30 transition-colors"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 text-primary`} />
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16"
          >
            <h3 className="font-display text-2xl font-semibold mb-8 text-muted-foreground">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: '1. Share Your Mood', desc: 'Tell us how you feel or let our AI detect your emotional state via camera & mic.' },
                { icon: Zap, title: '2. Get Adaptive Content', desc: 'Receive a personalized curriculum with videos, articles, or both — tuned to your energy.' },
                { icon: Shield, title: '3. Learn & Track', desc: 'Progress through modules at your own pace with real-time progress tracking.' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-left hover:border-primary/30 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
