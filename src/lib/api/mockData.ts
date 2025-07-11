// Shared mock data for development
export const mockTasks = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'todo',
    projectId: '1',
    tags: ['sample'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockProjects = [
  {
    id: '1',
    name: 'Default Project',
    icon: '📁',
    folderId: null,
    taskIds: ['1'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockFolders = [
  {
    id: '1',
    name: 'Default Folder',
    icon: '📁',
    projectIds: ['1'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];
