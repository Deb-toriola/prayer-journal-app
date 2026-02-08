import { useState, useEffect, useCallback } from 'react';
import { loadWeeklyProject, saveWeeklyProject } from '../utils/storage';

export function useWeeklyProject() {
  const [project, setProject] = useState(() => loadWeeklyProject());

  useEffect(() => {
    saveWeeklyProject(project);
  }, [project]);

  const updateProject = useCallback((updates) => {
    setProject((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  return { project, updateProject };
}
