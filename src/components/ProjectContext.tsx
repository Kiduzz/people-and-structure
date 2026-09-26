import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Project = {
  id: string;
  name: string;
  color: string;
};

type ProjectContextType = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectContext = createContext<ProjectContextType>({ projects: [], setProjects: () => {} });

const STORAGE_KEY = 'orgbuilder-projects-v1';

export function ProjectProvider({ children, chartId }: { children: ReactNode, chartId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const storageKey = `orgbuilder-projects-${chartId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load projects', e);
      }
    } else {
      setProjects([]);
    }
    setMounted(true);
  }, [chartId]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, JSON.stringify(projects));
    }
  }, [projects, mounted, storageKey]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => useContext(ProjectContext);
