import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMood } from '@/contexts/MoodContext';
import { useProgress, LearningPathHistory } from '@/contexts/ProgressContext';
import { 
  ArrowLeft, 
  BookOpen,
  Trophy,
  Flame,
  Calendar,
  Clock,
  Trash2,
  Play,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function LearningProgressView() {
  const navigate = useNavigate();
  const { moodColors } = useMood();
  const { history, deletePath } = useProgress();

  const totalCompleted = history.reduce((acc, path) => acc + path.completedModules.length, 0);
  const totalModules = history.reduce((acc, path) => acc + path.totalModules, 0);
  const overallProgress = totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;

  const continuePath = (path: LearningPathHistory) => {
    navigate('/learning-path', {
      state: {
        topic: path.topic,
        mood: path.mood,
        speed: path.speed,
        format: path.format,
        goal: path.goal,
        pathId: path.id
      }
    });
  };

  const handleDelete = (pathId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this learning path?')) {
      deletePath(pathId);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${moodColors.gradient} rounded-full blur-3xl opacity-10`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${moodColors.gradient}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="font-display text-3xl font-bold">My Learning Progress</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-2xl bg-muted/30">
              <div className="text-3xl font-bold mb-1">{history.length}</div>
              <span className="text-sm text-muted-foreground">Learning Paths</span>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/30">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-1">
                <Flame className="w-6 h-6 text-orange-500" />
                {totalCompleted}
              </div>
              <span className="text-sm text-muted-foreground">Modules Completed</span>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/30">
              <div className="text-3xl font-bold mb-1">{totalModules}</div>
              <span className="text-sm text-muted-foreground">Total Modules</span>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/30">
              <div className="text-3xl font-bold mb-1">{Math.round(overallProgress)}%</div>
              <span className="text-sm text-muted-foreground">Overall Progress</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${moodColors.gradient}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Learning Paths History */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Learning Paths Yet</h2>
            <p className="text-muted-foreground mb-6">Start your learning journey by creating your first path!</p>
            <Button variant="mood" onClick={() => navigate('/create-path')}>
              Create Learning Path
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Learning Paths</h2>
            {history.map((path, index) => {
              const pathProgress = path.totalModules > 0 
                ? (path.completedModules.length / path.totalModules) * 100 
                : 0;
              const isComplete = pathProgress === 100;

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-border',
                    isComplete && 'border-primary/30 bg-primary/5'
                  )}
                  onClick={() => continuePath(path)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                        isComplete 
                          ? `bg-gradient-to-br ${moodColors.gradient}` 
                          : 'bg-muted'
                      )}>
                        {isComplete ? (
                          <Trophy className="w-6 h-6" />
                        ) : (
                          <BookOpen className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{path.topic}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{path.goal}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(path.createdAt, 'MMM d, yyyy')}
                          </span>
                          <span className="capitalize px-2 py-0.5 rounded-full bg-muted">
                            {path.mood}
                          </span>
                          <span className="capitalize px-2 py-0.5 rounded-full bg-muted">
                            {path.speed}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xl font-bold">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          {path.completedModules.length}/{path.totalModules}
                        </div>
                        <span className="text-sm text-muted-foreground">{Math.round(pathProgress)}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant={isComplete ? 'outline' : 'mood'} 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            continuePath(path);
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {isComplete ? 'Review' : 'Continue'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(path.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Path Progress Bar */}
                  <div className="mt-4">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pathProgress}%` }}
                        className={`h-full bg-gradient-to-r ${moodColors.gradient} transition-all duration-300`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recent Activity */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="glass-card rounded-2xl p-6">
              {history
                .flatMap(path => 
                  path.completedModules.map(module => ({
                    ...module,
                    pathTopic: path.topic,
                    pathId: path.id
                  }))
                )
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
                .map((activity, index) => (
                  <div 
                    key={`${activity.pathId}-${activity.id}`}
                    className={cn(
                      'flex items-center gap-4 py-3',
                      index !== 0 && 'border-t border-border'
                    )}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${moodColors.gradient}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.pathTopic}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(activity.completedAt, 'MMM d, h:mm a')}
                    </span>
                  </div>
                ))
              }
              {history.flatMap(p => p.completedModules).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No completed modules yet. Start learning to see your progress!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
