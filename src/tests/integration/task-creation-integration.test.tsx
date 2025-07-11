import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TASK_STATUS } from '~constants/task';

import AddTask from '../../components/TasksList/AddTask';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-project-id' }),
}));

// Mock the task store
const mockCreateTask = jest.fn();
jest.mock('~stores/taskStore', () => ({
  useTaskStore: () => ({
    createTask: mockCreateTask,
  }),
}));

describe('Task Creation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateTask.mockResolvedValue(undefined);
  });

  it('creates a new task successfully', async () => {
    render(<AddTask />);

    // Click add task button
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('add-task-input')).toBeInTheDocument();
    });

    // Enter task name
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: 'New Task' } });

    // Submit form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          projectId: 'test-project-id',
          status: TASK_STATUS.TODO,
        }),
      );
    });
  });

  it('validates required fields', async () => {
    render(<AddTask />);

    // Click add task button
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('add-task-input')).toBeInTheDocument();
    });

    // Try to submit without entering task name
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    // Should not call createTask
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('cancels task creation', async () => {
    render(<AddTask />);

    // Click add task button
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId('add-task-input')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByTestId('add-task-cancel');
    fireEvent.click(cancelButton);

    // Should return to add button state
    await waitFor(() => {
      expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    });

    // Should not call createTask
    expect(mockCreateTask).not.toHaveBeenCalled();
  });
});
