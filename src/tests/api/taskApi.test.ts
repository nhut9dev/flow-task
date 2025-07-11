import { apiClient } from '~lib/api/client';
import { TaskApiService } from '~lib/api/tasks';
import { AppError } from '~lib/errors/AppError';

jest.mock('~lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TaskApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Test Task 1', status: 'todo', projectId: 'project-1' },
        { id: '2', title: 'Test Task 2', status: 'done', projectId: 'project-1' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks });
      const result = await TaskApiService.getTasks();
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', { projectId: undefined });
      expect(result).toEqual({ data: mockTasks });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch tasks';
      (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(TaskApiService.getTasks()).rejects.toThrow(errorMessage);
    });

    it('should fetch tasks by project ID', async () => {
      const projectId = 'project-1';
      const mockTasks = [
        {
          id: '1',
          title: 'Project Task',
          status: 'todo',
          projectId,
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks });

      const result = await TaskApiService.getTasksByProject(projectId);

      expect(apiClient.get).toHaveBeenCalledWith(`/projects/${projectId}/tasks`);
      expect(result).toEqual({ data: mockTasks });
    });
  });

  describe('getTaskById', () => {
    it('should fetch a single task successfully', async () => {
      const taskId = 'task-1';
      const mockTask = {
        id: taskId,
        title: 'Single Task',
        status: 'todo',
        projectId: 'project-1',
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTask });

      const result = await TaskApiService.getTaskById(taskId);

      expect(apiClient.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(result).toEqual({ data: mockTask });
    });

    it('should handle task not found', async () => {
      const taskId = 'non-existent';
      (apiClient.get as jest.Mock).mockRejectedValue(new AppError('Task not found', 404));

      await expect(TaskApiService.getTaskById(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description',
        projectId: 'project-1',
        tags: ['urgent'],
        dueDate: ['2024-12-31'],
      };

      const createdTask = {
        id: 'new-task-id',
        ...newTask,
        status: 'todo',
        createdAt: '2024-01-01T00:00:00Z',
        modifiedAt: '2024-01-01T00:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: createdTask });

      const result = await TaskApiService.createTask(newTask);

      expect(apiClient.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result).toEqual({ data: createdTask });
    });

    it('should handle validation errors', async () => {
      const invalidTask = {
        title: '', // Invalid: empty title
        projectId: 'project-1',
        tags: [],
        dueDate: [],
      };

      (apiClient.post as jest.Mock).mockRejectedValue(new AppError('Title is required', 400));

      await expect(TaskApiService.createTask(invalidTask)).rejects.toThrow('Title is required');
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = 'task-1';
      const updates = {
        title: 'Updated Task',
        status: 'done',
      };

      const updatedTask = {
        id: taskId,
        title: 'Updated Task',
        status: 'done',
        projectId: 'project-1',
        modifiedAt: '2024-01-01T00:00:00Z',
      };

      (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedTask });

      const result = await TaskApiService.updateTask(taskId, updates);

      expect(apiClient.put).toHaveBeenCalledWith(`/tasks/${taskId}`, updates);
      expect(result).toEqual({ data: updatedTask });
    });

    it('should handle task not found during update', async () => {
      const taskId = 'non-existent';
      const updates = { title: 'Updated Task' };

      (apiClient.put as jest.Mock).mockRejectedValue(new AppError('Task not found', 404));

      await expect(TaskApiService.updateTask(taskId, updates)).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = 'task-1';
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: { message: 'Task deleted' } });

      const result = await TaskApiService.deleteTask(taskId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(result).toEqual({ data: { message: 'Task deleted' } });
    });

    it('should handle task not found during deletion', async () => {
      const taskId = 'non-existent';
      (apiClient.delete as jest.Mock).mockRejectedValue(new AppError('Task not found', 404));

      await expect(TaskApiService.deleteTask(taskId)).rejects.toThrow('Task not found');
    });
  });

  describe('getTasksByFolder', () => {
    it('should fetch tasks by folder ID successfully', async () => {
      const folderId = 'folder-1';
      const mockTasks = [
        {
          id: '1',
          title: 'Folder Task',
          status: 'todo',
          folderId,
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockTasks });

      const result = await TaskApiService.getTasksByFolder(folderId);

      expect(apiClient.get).toHaveBeenCalledWith(`/folders/${folderId}/tasks`);
      expect(result).toEqual({ data: mockTasks });
    });
  });
});
