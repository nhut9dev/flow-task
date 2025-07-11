import { apiClient } from '~lib/api/client';
import { TaskApiService } from '~lib/api/tasks';

// Mock the apiClient
jest.mock('~lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('TaskApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'TODO' },
        { id: '2', title: 'Task 2', status: 'DONE' },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockTasks,
        success: true,
      });

      const result = await TaskApiService.getTasks();

      expect(mockApiClient.get).toHaveBeenCalledWith('/tasks', { projectId: undefined });
      expect(result.data).toEqual(mockTasks);
      expect(result.success).toBe(true);
    });

    it('should fetch tasks by project ID', async () => {
      const projectId = 'project-1';
      const mockTasks = [{ id: '1', title: 'Task 1', projectId }];

      mockApiClient.get.mockResolvedValue({
        data: mockTasks,
        success: true,
      });

      const result = await TaskApiService.getTasks(projectId);

      expect(mockApiClient.get).toHaveBeenCalledWith('/tasks', { projectId });
      expect(result.data).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description',
        tags: ['urgent'],
        dueDate: [],
      };

      const createdTask = { id: '1', ...newTask, status: 'TODO' };

      mockApiClient.post.mockResolvedValue({
        data: createdTask,
        success: true,
      });

      const result = await TaskApiService.createTask(newTask);

      expect(mockApiClient.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(result.data).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = '1';
      const updates = { title: 'Updated Task', status: 'DONE' };

      const updatedTask = { id: taskId, ...updates };

      mockApiClient.put.mockResolvedValue({
        data: updatedTask,
        success: true,
      });

      const result = await TaskApiService.updateTask(taskId, updates);

      expect(mockApiClient.put).toHaveBeenCalledWith(`/tasks/${taskId}`, updates);
      expect(result.data).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';

      mockApiClient.delete.mockResolvedValue({
        data: undefined,
        success: true,
      });

      const result = await TaskApiService.deleteTask(taskId);

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(result.success).toBe(true);
    });
  });
});
