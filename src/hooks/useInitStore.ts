import { useEffect } from 'react';

import { PROJECT_DEFAULT_DATA } from '~constants/project';
import { useFolderStore } from '~stores/folderStore';
import { useProjectStore } from '~stores/projectStore';
import { useTaskStore } from '~stores/taskStore';

export const useInitProjectStore = () => {
  const { projects, loading, error, fetchProjects, setProjects, clearError } = useProjectStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try to fetch from API first
        await fetchProjects();
      } catch (error) {
        // If API fails, fallback to default data
        console.warn('Failed to fetch projects from API, using default data:', error);
        setProjects(PROJECT_DEFAULT_DATA);
      }
    };

    // Only initialize if we don't have projects and not currently loading
    if (projects.length === 0 && !loading) {
      initializeData();
    }
  }, [projects.length, loading, fetchProjects, setProjects]);

  return { loading, error, clearError };
};

export const useInitFolderStore = () => {
  const { folders, loading, error, fetchFolders, clearError } = useFolderStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchFolders();
      } catch (error) {
        console.warn('Failed to fetch folders from API:', error);
        // Folders can be empty initially, so no fallback needed
      }
    };

    if (folders.length === 0 && !loading) {
      initializeData();
    }
  }, [folders.length, loading, fetchFolders]);

  return { loading, error, clearError };
};

export const useInitTaskStore = () => {
  const { tasks, loading, error, fetchTasks, clearError } = useTaskStore();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        console.warn('Failed to fetch tasks from API:', error);
        // Tasks can be empty initially, so no fallback needed
      }
    };

    if (tasks.length === 0 && !loading) {
      initializeData();
    }
  }, [tasks.length, loading, fetchTasks]);

  return { loading, error, clearError };
};
