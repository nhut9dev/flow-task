import { useEffect } from 'react';

import { useFolderStore } from '~stores/folderStore';
import { useProjectStore } from '~stores/projectStore';
import { useTaskStore } from '~stores/taskStore';

interface UseInitStoreOptions {
  fetchFolders?: boolean;
  fetchProjects?: boolean;
  fetchTasks?: boolean;
  projectId?: string;
}

export function useInitStore(options: UseInitStoreOptions = {}) {
  const { fetchFolders = false, fetchProjects = false, fetchTasks = false, projectId } = options;

  const fetchFoldersAction = useFolderStore((state) => state.fetchFolders);
  const fetchProjectsAction = useProjectStore((state) => state.fetchProjects);
  const fetchTasksAction = useTaskStore((state) => state.fetchTasks);
  const fetchTasksByProjectAction = useTaskStore((state) => state.fetchTasksByProject);

  useEffect(() => {
    const loadData = async () => {
      try {
        const promises = [];

        if (fetchFolders) {
          promises.push(fetchFoldersAction());
        }

        if (fetchProjects) {
          promises.push(fetchProjectsAction());
        }

        if (fetchTasks) {
          if (projectId) {
            promises.push(fetchTasksByProjectAction(projectId));
          } else {
            promises.push(fetchTasksAction());
          }
        }

        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to initialize store data:', error);
      }
    };

    loadData();
  }, [
    fetchFolders,
    fetchProjects,
    fetchTasks,
    projectId,
    fetchFoldersAction,
    fetchProjectsAction,
    fetchTasksAction,
    fetchTasksByProjectAction,
  ]);
}
