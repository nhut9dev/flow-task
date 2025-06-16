export const ROUTES = {
  HOME: { path: '/', label: 'Home' },

  FOLDER: {
    INDEX: { path: '/folders', label: 'Folders' },
    DETAIL: (folderId: string) => ({
      path: `/folders/${folderId}`,
      label: `Folder ${folderId}`,
    }),
    PROJECTS: (folderId: string) => ({
      path: `/folders/${folderId}/projects`,
      label: 'Projects',
    }),
  },

  PROJECT: {
    DETAIL: (folderId: string, projectId: string) => ({
      path: `/folders/${folderId}/projects/${projectId}`,
      label: `Project ${projectId}`,
    }),
    TASKS: (folderId: string, projectId: string) => ({
      path: `/folders/${folderId}/projects/${projectId}/tasks`,
      label: 'Tasks',
    }),
  },

  TASK: {
    DETAIL: (folderId: string, projectId: string, taskId: string) => ({
      path: `/folders/${folderId}/projects/${projectId}/tasks/${taskId}`,
      label: `Task ${taskId}`,
    }),
  },

  SETTINGS: { path: '/settings', label: 'Settings' },
};
