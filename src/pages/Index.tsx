import { LandingHero } from '@/components/LandingHero';
import { motion } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { Brain, Zap, LineChart, Users, Sparkles, Shield } from 'lucide-react';

const Index = () => {
  const { moodColors } = useMood();

  const features = [
    {
      icon: Brain,
      title: 'Emotion AI',
      description: 'Advanced algorithms detect your emotional state and adjust learning content accordingly.'
    },
    {
      icon: Zap,
      title: 'Adaptive Pacing',
      description: 'Content difficulty and speed adapt in real-time based on your energy levels.'
    },
    {
      icon: LineChart,
      title: 'Progress Analytics',
      description: 'Track your learning patterns and emotional trends over time.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Connect with learners who share similar emotional learning patterns.'
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Get personalized content suggestions based on your mood history.'
    },
    {
      icon: Shield,
      title: 'Safe Learning Space',
      description: 'Your emotional data is private and used only to enhance your experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHero />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        
        <div className="relative container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Why Choose{' '}
              <span className={`bg-gradient-to-r ${moodColors.gradient} bg-clip-text text-transparent`}>
                Emotion Learning?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Traditional learning ignores how you feel. We believe emotions are the key to effective learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${moodColors.gradient} opacity-5`} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Learn Smarter?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their education journey with emotion-adaptive learning.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-xl bg-gradient-to-r ${moodColors.gradient} font-semibold text-lg shadow-lg transition-all`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="font-display text-lg mb-2">EmotionLearn</p>
          <p className="text-sm">Adaptive learning that understands you.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
