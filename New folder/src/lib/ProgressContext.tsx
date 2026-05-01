import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProgress {
  level: number;
  completedModules: string[];
  ethicsSigned: boolean;
}

interface ProgressContextType {
  progress: UserProgress;
  completeModule: (moduleId: string) => void;
  signEthics: () => void;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>({
    level: 0,
    completedModules: [],
    ethicsSigned: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cyber_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cyber_progress', JSON.stringify(progress));
    }
  }, [progress, isLoading]);

  const completeModule = (moduleId: string) => {
    setProgress(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      const newModules = [...prev.completedModules, moduleId];
      
      // logic to level up: Must have ethics signed and 2+ modules
      let newLevel = prev.level;
      if (newModules.length >= 2 && prev.level === 0 && prev.ethicsSigned) {
        newLevel = 1;
        console.log("🛡️ LEVEL_ADVANCED: User reached Level 1");
      }
      
      return { ...prev, completedModules: newModules, level: newLevel };
    });
  };

  const signEthics = () => {
    setProgress(prev => {
      // Check if they already have 2 modules when signing ethics
      const shouldAdvance = prev.completedModules.length >= 2 && prev.level === 0;
      return { ...prev, ethicsSigned: true, level: shouldAdvance ? 1 : prev.level };
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, completeModule, signEthics, isLoading }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
