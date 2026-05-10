import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Project } from '../types/project';

interface ProjectContextValue {
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedProject');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedProjectState(parsed);
      } catch {
        localStorage.removeItem('selectedProject');
      }
    }
  }, []);

  const setSelectedProject = useCallback((project: Project) => {
    setSelectedProjectState(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
  }, []);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}