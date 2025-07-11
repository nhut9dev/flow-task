import { act, renderHook } from '@testing-library/react';

import { TaskApiService } from '~lib/api/tasks';
import { AppError } from '~lib/errors/AppError';
import { useTaskStore } from '~stores/taskStore';

// Mock the API service
jest.mock('~lib/api/tasks', () => ({
  TaskApiService: {
    getTasks: jest.fn(),
    getTasksByProject: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

const mockTaskApiService = TaskApiService as jest.Mocked<typeof TaskApiService>;

describe('TaskStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const { result } = renderHook(() => useTaskStore());
    act(() => {
      result.current.setTasks([]);
      result.current.setLoading(false);
      result.current.setError(null);
    });
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'TODO' },
        { id: '2', title: 'Task 2', status: 'DONE' },
      ];

      mockTaskApiService.getTasks.mockResolvedValue({
        data: mockTasks,
        success: true,
      });

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(mockTaskApiService.getTasks).toHaveBeenCalledWith(undefined);
      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle fetch error', async () => {
      const error = new AppError('Failed to fetch', 500);
      mockTaskApiService.getTasks.mockRejectedValue(error);

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        try {
          await result.current.fetchTasks();
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeInstanceOf(AppError);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('fetchTasksByProject', () => {
    it('should fetch tasks by project successfully', async () => {
      const projectId = 'project-1';
      const mockTasks = [{ id: '1', title: 'Task 1', projectId }];

      mockTaskApiService.getTasksByProject.mockResolvedValue({
        data: mockTasks,
        success: true,
      });

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.fetchTasksByProject(projectId);
      });

      expect(mockTaskApiService.getTasksByProject).toHaveBeenCalledWith(projectId);
      expect(result.current.tasks).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        tags: [],
        dueDate: [],
        projectId: 'project-1',
      };

      const createdTask = { id: '1', ...taskData, status: 'TODO' };

      mockTaskApiService.createTask.mockResolvedValue({
        data: createdTask,
        success: true,
      });

      const { result } = renderHook(() => useTaskStore());

      await act(async () => {
        await result.current.createTask(taskData);
      });

      expect(mockTaskApiService.createTask).toHaveBeenCalledWith(taskData);
      expect(result.current.tasks).toContainEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = '1';
      const updates = { title: 'Updated Task' };
      const updatedTask = { id: taskId, title: 'Updated Task', status: 'DONE' };

      // Set initial state
      const { result } = renderHook(() => useTaskStore());
      act(() => {
        result.current.setTasks([{ id: taskId, title: 'Original Task', status: 'TODO' }]);
      });

      mockTaskApiService.updateTask.mockResolvedValue({
        data: updatedTask,
        success: true,
      });

      await act(async () => {
        await result.current.updateTask(taskId, updates);
      });

      expect(mockTaskApiService.updateTask).toHaveBeenCalledWith(taskId, updates);
      expect(result.current.tasks[0]).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = '1';

      // Set initial state
      const { result } = renderHook(() => useTaskStore());
      act(() => {
        result.current.setTasks([
          { id: taskId, title: 'Task to delete', status: 'TODO' },
          { id: '2', title: 'Keep this task', status: 'TODO' },
        ]);
      });

      mockTaskApiService.deleteTask.mockResolvedValue({
        data: undefined,
        success: true,
      });

      await act(async () => {
        await result.current.deleteTask(taskId);
      });

      expect(mockTaskApiService.deleteTask).toHaveBeenCalledWith(taskId);
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe('2');
    });
  });

  describe('getTasksByProjectId', () => {
    it('should filter tasks by project ID', () => {
      const { result } = renderHook(() => useTaskStore());

      act(() => {
        result.current.setTasks([
          { id: '1', title: 'Task 1', projectId: 'project-1' },
          { id: '2', title: 'Task 2', projectId: 'project-2' },
          { id: '3', title: 'Task 3', projectId: 'project-1' },
        ]);
      });

      const projectTasks = result.current.getTasksByProjectId('project-1');
      expect(projectTasks).toHaveLength(2);
      expect(projectTasks[0].id).toBe('1');
      expect(projectTasks[1].id).toBe('3');
    });
  });
});
