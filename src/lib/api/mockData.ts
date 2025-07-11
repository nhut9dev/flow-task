// Shared mock data for development
export interface MockTask {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  tags: string[];
  dueDate: string[];
  createdAt: string;
  modifiedAt: string;
}

export interface MockProject {
  id: string;
  name: string;
  icon: string;
  folderId: string | null;
  taskIds: string[];
  createdAt: string;
  modifiedAt: string;
}

export interface MockFolder {
  id: string;
  name: string;
  icon: string;
  projectIds: string[];
  createdAt: string;
  modifiedAt: string;
}

export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: 'Setup development environment',
    description: 'Install Node.js, Git, and configure IDE',
    status: 'done',
    projectId: '1',
    tags: ['setup', 'development'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Design user interface',
    description: 'Create wireframes and mockups for the main features',
    status: 'in_progress',
    projectId: '1',
    tags: ['design', 'ui'],
    dueDate: ['2024-12-15'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Implement authentication system',
    description: 'Add user login, registration, and JWT token management',
    status: 'todo',
    projectId: '1',
    tags: ['backend', 'security'],
    dueDate: ['2024-12-20'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Research market trends',
    description: 'Analyze competitor products and market opportunities',
    status: 'done',
    projectId: '2',
    tags: ['research', 'business'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Create business plan',
    description: 'Develop comprehensive business strategy and financial projections',
    status: 'in_progress',
    projectId: '2',
    tags: ['planning', 'business'],
    dueDate: ['2024-12-25'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    title: 'Plan vacation itinerary',
    description: 'Research destinations, book flights and hotels',
    status: 'todo',
    projectId: '3',
    tags: ['travel', 'planning'],
    dueDate: ['2024-12-10'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    title: 'Pack luggage',
    description: 'Prepare clothes, documents, and travel essentials',
    status: 'todo',
    projectId: '3',
    tags: ['travel', 'preparation'],
    dueDate: ['2024-12-08'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    title: 'Read React documentation',
    description: 'Study React hooks, context, and best practices',
    status: 'done',
    projectId: '4',
    tags: ['learning', 'react'],
    dueDate: [],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    title: 'Build sample project',
    description: 'Create a small React app to practice concepts',
    status: 'in_progress',
    projectId: '4',
    tags: ['learning', 'practice'],
    dueDate: ['2024-12-18'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    title: 'Organize workspace',
    description: 'Clean desk, organize files, and optimize setup',
    status: 'todo',
    projectId: '5',
    tags: ['organization', 'productivity'],
    dueDate: ['2024-12-05'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    title: 'Setup productivity tools',
    description: 'Install and configure time tracking, note-taking apps',
    status: 'todo',
    projectId: '5',
    tags: ['productivity', 'tools'],
    dueDate: ['2024-12-07'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockProjects: MockProject[] = [
  {
    id: '1',
    name: 'Web Application Development',
    icon: '💻',
    folderId: null,
    taskIds: ['1', '2', '3'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Business Strategy',
    icon: '📊',
    folderId: null,
    taskIds: ['4', '5'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Vacation Planning',
    icon: '✈️',
    folderId: null,
    taskIds: ['6', '7'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'React Learning',
    icon: '⚛️',
    folderId: null,
    taskIds: ['8', '9'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Workspace Optimization',
    icon: '🏠',
    folderId: null,
    taskIds: ['10', '11'],
    createdAt: '2024-01-01T00:00:00Z',
    modifiedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockFolders: MockFolder[] = [];

// Helper functions to maintain data consistency
export const addTaskToProject = (taskId: string, projectId: string) => {
  const project = mockProjects.find((p) => p.id === projectId);
  if (project && !project.taskIds.includes(taskId)) {
    project.taskIds.push(taskId);
    project.modifiedAt = new Date().toISOString();
  }
};

export const removeTaskFromProject = (taskId: string, projectId: string) => {
  const project = mockProjects.find((p) => p.id === projectId);
  if (project) {
    project.taskIds = project.taskIds.filter((id) => id !== taskId);
    project.modifiedAt = new Date().toISOString();
  }
};

export const addProjectToFolder = (projectId: string, folderId: string) => {
  const folder = mockFolders.find((f) => f.id === folderId);
  if (folder && !folder.projectIds.includes(projectId)) {
    folder.projectIds.push(projectId);
    folder.modifiedAt = new Date().toISOString();
  }
};

export const removeProjectFromFolder = (projectId: string, folderId: string) => {
  const folder = mockFolders.find((f) => f.id === folderId);
  if (folder) {
    folder.projectIds = folder.projectIds.filter((id) => id !== projectId);
    folder.modifiedAt = new Date().toISOString();
  }
};

export const updateProjectFolder = (projectId: string, newFolderId: string | null) => {
  const project = mockProjects.find((p) => p.id === projectId);
  if (project) {
    // Remove from old folder
    if (project.folderId) {
      removeProjectFromFolder(projectId, project.folderId);
    }
    // Add to new folder
    if (newFolderId) {
      addProjectToFolder(projectId, newFolderId);
    }
    project.folderId = newFolderId;
    project.modifiedAt = new Date().toISOString();
  }
};
