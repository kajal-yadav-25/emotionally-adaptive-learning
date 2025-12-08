import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CompletedModule {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  completedAt: Date;
}

export interface LearningPathHistory {
  id: string;
  topic: string;
  mood: string;
  speed: string;
  format: string;
  goal: string;
  createdAt: Date;
  completedModules: CompletedModule[];
  totalModules: number;
}

interface ProgressContextType {
  history: LearningPathHistory[];
  addLearningPath: (path: Omit<LearningPathHistory, 'id' | 'createdAt' | 'completedModules'>) => string;
  updateModuleCompletion: (pathId: string, module: CompletedModule) => void;
  removeModuleCompletion: (pathId: string, moduleId: number) => void;
  getPathById: (pathId: string) => LearningPathHistory | undefined;
  deletePath: (pathId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<LearningPathHistory[]>(() => {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        completedModules: p.completedModules.map((m: any) => ({
          ...m,
          completedAt: new Date(m.completedAt)
        }))
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(history));
  }, [history]);

  const addLearningPath = (path: Omit<LearningPathHistory, 'id' | 'createdAt' | 'completedModules'>) => {
    const id = Date.now().toString();
    setHistory(prev => [...prev, {
      ...path,
      id,
      createdAt: new Date(),
      completedModules: []
    }]);
    return id;
  };

  const updateModuleCompletion = (pathId: string, module: CompletedModule) => {
    setHistory(prev => prev.map(p => 
      p.id === pathId 
        ? { ...p, completedModules: [...p.completedModules.filter(m => m.id !== module.id), module] }
        : p
    ));
  };

  const removeModuleCompletion = (pathId: string, moduleId: number) => {
    setHistory(prev => prev.map(p => 
      p.id === pathId 
        ? { ...p, completedModules: p.completedModules.filter(m => m.id !== moduleId) }
        : p
    ));
  };

  const getPathById = (pathId: string) => history.find(p => p.id === pathId);

  const deletePath = (pathId: string) => {
    setHistory(prev => prev.filter(p => p.id !== pathId));
  };

  return (
    <ProgressContext.Provider value={{ 
      history, 
      addLearningPath, 
      updateModuleCompletion, 
      removeModuleCompletion,
      getPathById,
      deletePath 
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
