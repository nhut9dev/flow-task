import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { PROJECT_DEFAULT_DATA, PROJECT_DEFAULT_KEY } from '~constants/project';
import { Project } from '~types/project';
import { Task } from '~types/task';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// In-memory storage for development (replace with database in production)
let projects: Project[] = [...PROJECT_DEFAULT_DATA];
let tasks: Task[] = [];

// Helper function to get default dueDate based on initData project
function getDefaultDueDateForInitDataProject(projectId: string): string[] {
  switch (projectId) {
    case PROJECT_DEFAULT_KEY.TODAY:
      return [dayjs().format('YYYY-MM-DD')];

    case PROJECT_DEFAULT_KEY.TOMORROW:
      return [dayjs().add(1, 'day').format('YYYY-MM-DD')];

    case PROJECT_DEFAULT_KEY.THIS_WEEK:
      return [dayjs().endOf('week').format('YYYY-MM-DD')];

    case PROJECT_DEFAULT_KEY.PLANNED:
      // For planned tasks, set due date to end of next week
      return [dayjs().add(1, 'week').endOf('week').format('YYYY-MM-DD')];

    case PROJECT_DEFAULT_KEY.HIGH_PRIORITY:
    case PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY:
    case PROJECT_DEFAULT_KEY.LOW_PRIORITY:
    case PROJECT_DEFAULT_KEY.BACKLOG:
    case PROJECT_DEFAULT_KEY.COMPLETED:
      // For priority and backlog tasks, no default due date
      return [];

    default:
      return [];
  }
}

// Helper function to get default tags based on initData project
function getDefaultTagsForInitDataProject(projectId: string): string[] {
  switch (projectId) {
    case PROJECT_DEFAULT_KEY.HIGH_PRIORITY:
      return ['high-priority'];

    case PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY:
      return ['medium-priority'];

    case PROJECT_DEFAULT_KEY.LOW_PRIORITY:
      return ['low-priority'];

    default:
      return [];
  }
}

// Initialize sample data for testing
function initializeSampleData() {
  if (tasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the proposal for the new client project',
        status: 'todo',
        projectId: null,
        tags: ['high-priority', 'urgent'],
        dueDate: [dayjs().format('YYYY-MM-DD')], // Today
        createdAt: dayjs().subtract(2, 'day').toISOString(),
        modifiedAt: dayjs().subtract(2, 'day').toISOString(),
      },
      {
        id: '2',
        title: 'Review code changes',
        description: 'Review pull requests for the main branch',
        status: 'in_progress',
        projectId: null,
        tags: ['medium-priority'],
        dueDate: [dayjs().add(1, 'day').format('YYYY-MM-DD')], // Tomorrow
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        modifiedAt: dayjs().subtract(1, 'day').toISOString(),
      },
      {
        id: '3',
        title: 'Plan team meeting',
        description: 'Schedule and prepare agenda for weekly team meeting',
        status: 'todo',
        projectId: null,
        tags: ['normal'],
        dueDate: [dayjs().endOf('week').format('YYYY-MM-DD')], // This week
        createdAt: dayjs().subtract(3, 'day').toISOString(),
        modifiedAt: dayjs().subtract(3, 'day').toISOString(),
      },
      {
        id: '4',
        title: 'Update documentation',
        description: 'Update API documentation with latest changes',
        status: 'done',
        projectId: null,
        tags: ['low-priority'],
        dueDate: [],
        createdAt: dayjs().subtract(5, 'day').toISOString(),
        modifiedAt: dayjs().subtract(1, 'day').toISOString(),
      },
      {
        id: '5',
        title: 'Fix critical bug',
        description: 'Fix the authentication bug in production',
        status: 'todo',
        projectId: null,
        tags: ['critical', 'high-priority'],
        dueDate: [dayjs().add(2, 'day').format('YYYY-MM-DD')],
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        modifiedAt: dayjs().subtract(1, 'day').toISOString(),
      },
      {
        id: '6',
        title: 'Backup database',
        description: 'Create weekly database backup',
        status: 'todo',
        projectId: null,
        tags: ['low'],
        dueDate: [],
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        modifiedAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ];

    tasks = sampleTasks;
  }
}

// Initialize sample data when the module is loaded
initializeSampleData();

// Helper functions for data management
export const initDataService = {
  // Project management
  getAllProjects: (): Project[] => {
    return projects;
  },

  getProjectsByFolder: (folderId: string | null): Project[] => {
    if (folderId === null) {
      // Return projects without folderId (including disabled initData projects)
      return projects.filter((project) => !project.folderId);
    }
    return projects.filter((project) => project.folderId === folderId);
  },

  getProjectById: (id: string): Project | undefined => {
    return projects.find((project) => project.id === id);
  },

  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'modifiedAt'>): Project => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: dayjs().toISOString(),
      modifiedAt: dayjs().toISOString(),
    };
    projects.push(newProject);
    return newProject;
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      modifiedAt: dayjs().toISOString(),
    };
    return projects[index];
  },

  deleteProject: (id: string): boolean => {
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return false;

    // Don't allow deletion of initData projects
    const project = projects[index];
    if (project.disabled) return false;

    projects.splice(index, 1);
    return true;
  },

  // Task management
  getAllTasks: (): Task[] => {
    return tasks;
  },

  getTasksByProject: (projectId: string): Task[] => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];

    // For initData projects, filter tasks based on project type
    if (project.disabled) {
      return filterTasksByInitDataProject(projectId, tasks);
    }

    // For regular projects, return tasks that belong to the project
    return tasks.filter((task) => task.projectId === projectId);
  },

  getTaskById: (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  },

  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'modifiedAt'>): Task => {
    // Check if this is an initData project
    const project = projects.find((p) => p.id === taskData.projectId);
    const isInitDataProject = project?.disabled === true;

    // Prepare task data with defaults for initData projects
    const finalTaskData = { ...taskData };

    if (isInitDataProject && taskData.projectId) {
      // Set default dueDate if not provided
      if (!taskData.dueDate || taskData.dueDate.length === 0) {
        finalTaskData.dueDate = getDefaultDueDateForInitDataProject(taskData.projectId);
      }

      // Set default tags if not provided
      if (!taskData.tags || taskData.tags.length === 0) {
        finalTaskData.tags = getDefaultTagsForInitDataProject(taskData.projectId);
      }
    }

    const newTask: Task = {
      ...finalTaskData,
      id: Date.now().toString(),
      createdAt: dayjs().toISOString(),
      modifiedAt: dayjs().toISOString(),
    };
    tasks.push(newTask);
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>): Task | null => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      modifiedAt: dayjs().toISOString(),
    };
    return tasks[index];
  },

  deleteTask: (id: string): boolean => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
  },

  // Reset data (for testing)
  resetData: () => {
    projects = [...PROJECT_DEFAULT_DATA];
    tasks = [];
    initializeSampleData();
  },
};

// Filter tasks based on initData project type
function filterTasksByInitDataProject(projectId: string, allTasks: Task[]): Task[] {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const endOfWeek = dayjs().endOf('week');

  switch (projectId) {
    case PROJECT_DEFAULT_KEY.TODAY:
      return allTasks.filter((task) => {
        if (!task.dueDate || task.dueDate.length === 0) return false;
        return task.dueDate.some((date) => dayjs(date).isSame(today, 'day'));
      });

    case PROJECT_DEFAULT_KEY.TOMORROW:
      return allTasks.filter((task) => {
        if (!task.dueDate || task.dueDate.length === 0) return false;
        return task.dueDate.some((date) => dayjs(date).isSame(tomorrow, 'day'));
      });

    case PROJECT_DEFAULT_KEY.THIS_WEEK:
      return allTasks.filter((task) => {
        if (!task.dueDate || task.dueDate.length === 0) return false;
        return task.dueDate.some((date) => {
          const taskDate = dayjs(date);
          return taskDate.isSameOrAfter(today, 'day') && taskDate.isSameOrBefore(endOfWeek, 'day');
        });
      });

    case PROJECT_DEFAULT_KEY.HIGH_PRIORITY:
      return allTasks.filter(
        (task) =>
          task.tags.includes('high-priority') ||
          task.tags.includes('urgent') ||
          task.tags.includes('critical'),
      );

    case PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY:
      return allTasks.filter(
        (task) => task.tags.includes('medium-priority') || task.tags.includes('normal'),
      );

    case PROJECT_DEFAULT_KEY.LOW_PRIORITY:
      return allTasks.filter(
        (task) => task.tags.includes('low-priority') || task.tags.includes('low'),
      );

    case PROJECT_DEFAULT_KEY.PLANNED:
      return allTasks.filter((task) => task.dueDate && task.dueDate.length > 0);

    case PROJECT_DEFAULT_KEY.BACKLOG:
      return allTasks.filter(
        (task) => task.status === 'todo' && (!task.dueDate || task.dueDate.length === 0),
      );

    case PROJECT_DEFAULT_KEY.COMPLETED:
      return allTasks.filter((task) => task.status === 'done');

    default:
      return [];
  }
}
