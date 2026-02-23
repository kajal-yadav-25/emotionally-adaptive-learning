import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMood } from '@/contexts/MoodContext';
import { useProgress, LearningPathHistory } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  BookOpen,
  Trophy,
  Flame,
  Calendar,
  Trash2,
  Play,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  Star,
  BarChart3,
  Award,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isToday, isYesterday } from 'date-fns';

function StatCard({ icon: Icon, value, label, gradient }: { icon: any; value: string | number; label: string; gradient: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="glass-card rounded-2xl p-5 text-center group hover:border-primary/30 transition-all"
    >
      <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow`}>
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <div className="text-2xl font-display font-bold">{value}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </motion.div>
  );
}

function AchievementBadge({ icon: Icon, title, unlocked, gradient }: { icon: any; title: string; unlocked: boolean; gradient: string }) {
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
        unlocked ? 'opacity-100' : 'opacity-30 grayscale'
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center',
        unlocked ? `bg-gradient-to-br ${gradient} shadow-lg` : 'bg-muted'
      )}>
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <span className="text-xs font-medium text-center">{title}</span>
    </motion.div>
  );
}

export function LearningProgressView() {
  const navigate = useNavigate();
  const { moodColors } = useMood();
  const { history, deletePath } = useProgress();
  const { user, signOut } = useAuth();

  const totalCompleted = history.reduce((acc, path) => acc + path.completedModules.length, 0);
  const totalModules = history.reduce((acc, path) => acc + path.totalModules, 0);
  const overallProgress = totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;

  // Calculate streak (consecutive days with activity)
  const activityDates = history
    .flatMap(p => p.completedModules.map(m => new Date(m.completedAt)))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  if (activityDates.length > 0) {
    const today = new Date();
    let checkDate = today;
    const dateSet = new Set(activityDates.map(d => format(d, 'yyyy-MM-dd')));
    
    if (dateSet.has(format(today, 'yyyy-MM-dd')) || dateSet.has(format(new Date(today.getTime() - 86400000), 'yyyy-MM-dd'))) {
      while (dateSet.has(format(checkDate, 'yyyy-MM-dd'))) {
        streak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    }
  }

  // Mood distribution
  const moodCounts: Record<string, number> = {};
  history.forEach(p => { moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Achievements
  const achievements = [
    { icon: Star, title: 'First Path', unlocked: history.length >= 1, gradient: 'from-yellow-400 to-amber-500' },
    { icon: Flame, title: '3-Day Streak', unlocked: streak >= 3, gradient: 'from-orange-500 to-red-500' },
    { icon: Trophy, title: '10 Modules', unlocked: totalCompleted >= 10, gradient: 'from-purple-500 to-pink-500' },
    { icon: Target, title: 'Path Complete', unlocked: history.some(p => p.completedModules.length === p.totalModules && p.totalModules > 0), gradient: 'from-green-500 to-emerald-500' },
    { icon: Award, title: '5 Paths', unlocked: history.length >= 5, gradient: 'from-blue-500 to-cyan-500' },
    { icon: Zap, title: 'Speed Learner', unlocked: totalCompleted >= 25, gradient: 'from-rose-500 to-pink-500' },
  ];

  const continuePath = (path: LearningPathHistory) => {
    navigate('/learning-path', {
      state: { topic: path.topic, mood: path.mood, speed: path.speed, format: path.format, goal: path.goal, pathId: path.id }
    });
  };

  const handleDelete = (pathId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this learning path?')) {
      deletePath(pathId);
    }
  };

  const formatActivityDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${moodColors.gradient} rounded-full blur-3xl opacity-10`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr ${moodColors.gradient} rounded-full blur-3xl opacity-5`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            My <span className={`bg-gradient-to-r ${moodColors.gradient} bg-clip-text text-transparent`}>Progress</span>
          </h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <StatCard icon={BookOpen} value={history.length} label="Learning Paths" gradient={moodColors.gradient} />
          <StatCard icon={CheckCircle2} value={totalCompleted} label="Modules Done" gradient="from-green-500 to-emerald-500" />
          <StatCard icon={Flame} value={`${streak}🔥`} label="Day Streak" gradient="from-orange-500 to-red-500" />
          <StatCard icon={BarChart3} value={`${Math.round(overallProgress)}%`} label="Completion" gradient="from-blue-500 to-cyan-500" />
          <StatCard icon={Target} value={topMood ? topMood[0] : '—'} label="Top Mood" gradient="from-purple-500 to-pink-500" />
        </motion.div>

        {/* Overall Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm text-muted-foreground">{totalCompleted}/{totalModules} modules</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${moodColors.gradient} rounded-full relative`}
            >
              {overallProgress > 5 && (
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-gradient" />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {achievements.map((a) => (
              <AchievementBadge key={a.title} {...a} />
            ))}
          </div>
        </motion.div>

        {/* Two-column layout for paths + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Paths */}
          <div className="lg:col-span-2">
            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-12 text-center"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No Learning Paths Yet</h2>
                <p className="text-muted-foreground mb-6">Start your learning journey!</p>
                <Button variant="mood" onClick={() => navigate('/create-path')}>
                  Create Learning Path
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold mb-3">Your Learning Paths</h2>
                {history.map((path, index) => {
                  const pathProgress = path.totalModules > 0 ? (path.completedModules.length / path.totalModules) * 100 : 0;
                  const isComplete = pathProgress === 100;

                  return (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'glass-card rounded-2xl p-5 cursor-pointer transition-all hover:border-primary/30',
                        isComplete && 'border-primary/20'
                      )}
                      onClick={() => continuePath(path)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            isComplete ? `bg-gradient-to-br ${moodColors.gradient}` : 'bg-muted'
                          )}>
                            {isComplete ? <Trophy className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold truncate">{path.topic}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {format(path.createdAt, 'MMM d, yyyy')}
                              <span className="px-1.5 py-0.5 rounded-full bg-muted capitalize">{path.mood}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-bold">{path.completedModules.length}/{path.totalModules}</div>
                            <div className="text-xs text-muted-foreground">{Math.round(pathProgress)}%</div>
                          </div>
                          <Button variant={isComplete ? 'outline' : 'mood'} size="sm" onClick={(e) => { e.stopPropagation(); continuePath(path); }}>
                            <Play className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={(e) => handleDelete(path.id, e)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div style={{ width: `${pathProgress}%` }} className={`h-full bg-gradient-to-r ${moodColors.gradient} transition-all duration-500`} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Recent Activity
            </h2>
            <div className="glass-card rounded-2xl p-5">
              {history.flatMap(path =>
                path.completedModules.map(module => ({
                  ...module,
                  pathTopic: path.topic,
                  pathId: path.id
                }))
              )
              .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
              .slice(0, 8)
              .map((activity, index) => (
                <div key={`${activity.pathId}-${activity.id}`} className={cn('flex items-start gap-3 py-3', index !== 0 && 'border-t border-border/50')}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${moodColors.gradient} shrink-0 mt-0.5`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.pathTopic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatActivityDate(new Date(activity.completedAt))}</p>
                  </div>
                </div>
              ))}
              {history.flatMap(p => p.completedModules).length === 0 && (
                <p className="text-center text-muted-foreground py-6 text-sm">
                  No completed modules yet. Start learning!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
