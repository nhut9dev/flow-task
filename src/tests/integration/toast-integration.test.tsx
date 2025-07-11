import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ToastProvider } from '~components/ui/toast-provider';
import { useToast } from '~hooks/useToast';

// Mock task store
jest.mock('~stores/taskStore', () => ({
  useTaskStore: () => ({
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    loading: false,
  }),
}));

// Test component để simulate task operations
const TaskOperationsComponent = () => {
  const toast = useToast();
  const { createTask, updateTask, deleteTask } = require('~stores/taskStore').useTaskStore();

  const handleCreateTask = async () => {
    try {
      await createTask({ title: 'New Task', description: 'Task description' });
      toast({
        title: 'Thành công!',
        description: 'Tạo task thành công.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Không thể tạo task.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask('task-id', { title: 'Updated Task' });
      toast({
        title: 'Cập nhật thành công!',
        description: 'Task đã được cập nhật.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Không thể cập nhật task.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask('task-id');
      toast({
        title: 'Xóa thành công!',
        description: 'Task đã được xóa.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Không thể xóa task.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <button onClick={handleCreateTask}>Create Task</button>
      <button onClick={handleUpdateTask}>Update Task</button>
      <button onClick={handleDeleteTask}>Delete Task</button>
    </div>
  );
};

describe('Toast Integration with Task Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows success toast when task is created successfully', async () => {
    const mockCreateTask = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('~stores/taskStore'), 'useTaskStore').mockReturnValue({
      createTask: mockCreateTask,
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      loading: false,
    });

    render(
      <ToastProvider>
        <TaskOperationsComponent />
      </ToastProvider>,
    );

    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Thành công!')).toBeInTheDocument();
      expect(screen.getByText('Tạo task thành công.')).toBeInTheDocument();
    });
  });

  it('shows error toast when task creation fails', async () => {
    const mockCreateTask = jest.fn().mockRejectedValue(new Error('Creation failed'));
    jest.spyOn(require('~stores/taskStore'), 'useTaskStore').mockReturnValue({
      createTask: mockCreateTask,
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      loading: false,
    });

    render(
      <ToastProvider>
        <TaskOperationsComponent />
      </ToastProvider>,
    );

    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Lỗi!')).toBeInTheDocument();
      expect(screen.getByText('Không thể tạo task.')).toBeInTheDocument();
    });
  });

  it('shows success toast when task is updated successfully', async () => {
    const mockUpdateTask = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('~stores/taskStore'), 'useTaskStore').mockReturnValue({
      createTask: jest.fn(),
      updateTask: mockUpdateTask,
      deleteTask: jest.fn(),
      loading: false,
    });

    render(
      <ToastProvider>
        <TaskOperationsComponent />
      </ToastProvider>,
    );

    const updateButton = screen.getByText('Update Task');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Cập nhật thành công!')).toBeInTheDocument();
      expect(screen.getByText('Task đã được cập nhật.')).toBeInTheDocument();
    });
  });

  it('shows success toast when task is deleted successfully', async () => {
    const mockDeleteTask = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('~stores/taskStore'), 'useTaskStore').mockReturnValue({
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: mockDeleteTask,
      loading: false,
    });

    render(
      <ToastProvider>
        <TaskOperationsComponent />
      </ToastProvider>,
    );

    const deleteButton = screen.getByText('Delete Task');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Xóa thành công!')).toBeInTheDocument();
      expect(screen.getByText('Task đã được xóa.')).toBeInTheDocument();
    });
  });

  it('can display multiple toasts simultaneously', async () => {
    const mockCreateTask = jest.fn().mockResolvedValue(undefined);
    const mockUpdateTask = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(require('~stores/taskStore'), 'useTaskStore').mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      deleteTask: jest.fn(),
      loading: false,
    });

    render(
      <ToastProvider>
        <TaskOperationsComponent />
      </ToastProvider>,
    );

    const createButton = screen.getByText('Create Task');
    const updateButton = screen.getByText('Update Task');

    fireEvent.click(createButton);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Thành công!')).toBeInTheDocument();
      expect(screen.getByText('Cập nhật thành công!')).toBeInTheDocument();
    });
  });
});
