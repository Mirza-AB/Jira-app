import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Project } from "../types/project";

interface ProjectContextValue {
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  revalidate: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(
    () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("selectedProject");
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            localStorage.removeItem("selectedProject");
          }
        }
      }
      return null;
    },
  );

  const setSelectedProject = useCallback((project: Project) => {
    setSelectedProjectState(project);
    localStorage.setItem("selectedProject", JSON.stringify(project));
  }, []);

  const revalidate = useCallback(() => {
    const stored = localStorage.getItem("selectedProject");
    if (stored) {
      try {
        setSelectedProjectState(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selectedProject");
      }
    }
  }, []);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return (
    <ProjectContext.Provider
      value={{ selectedProject, setSelectedProject, revalidate }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
}
