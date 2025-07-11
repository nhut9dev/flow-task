import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'next/navigation';
import React from 'react';

import AddTaskItem from '~components/TasksList/AddTask';
import { useTaskStore } from '~stores/taskStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

// Mock task store
jest.mock('~stores/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseTaskStore = useTaskStore as jest.MockedFunction<typeof useTaskStore>;

describe('AddTaskItem', () => {
  const mockCreateTask = jest.fn();
  const mockProjectId = 'test-project-id';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: mockProjectId });
    mockUseTaskStore.mockReturnValue({
      createTask: mockCreateTask,
      loading: false,
      error: null,
    });
  });

  it('renders add task button when not editing', () => {
    render(<AddTaskItem />);

    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('＋')).toBeInTheDocument();
  });

  it('shows input form when add button is clicked', () => {
    render(<AddTaskItem />);

    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-task-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-task-confirm')).toBeInTheDocument();
    expect(screen.getByTestId('add-task-cancel')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task name')).toBeInTheDocument();
  });

  it('creates task when form is submitted with valid input', async () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Enter task name
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: 'New Test Task' } });

    // Submit form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Test Task',
          projectId: mockProjectId,
          status: 'todo',
        }),
      );
    });

    // Should return to button view
    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
  });

  it('creates task when Enter key is pressed', async () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Enter task name and press Enter
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: 'Task with Enter' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Task with Enter',
          projectId: mockProjectId,
        }),
      );
    });
  });

  it('cancels task creation when Cancel button is clicked', () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Click cancel button
    const cancelButton = screen.getByTestId('add-task-cancel');
    fireEvent.click(cancelButton);

    // Should return to button view
    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    expect(screen.queryByTestId('add-task-input')).not.toBeInTheDocument();
  });

  it('cancels task creation when Escape key is pressed', () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Press Escape key
    const input = screen.getByTestId('add-task-input');
    fireEvent.keyDown(input, { key: 'Escape' });

    // Should return to button view
    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    expect(screen.queryByTestId('add-task-input')).not.toBeInTheDocument();
  });

  it('does not create task with empty input', () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Submit empty form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('does not create task with whitespace-only input', () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Enter whitespace
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: '   ' } });

    // Submit form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('trims whitespace from task title', async () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Enter task name with whitespace
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: '  Trimmed Task  ' } });

    // Submit form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Trimmed Task',
          projectId: mockProjectId,
        }),
      );
    });
  });

  it('cancels task creation when input loses focus', () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Blur the input
    const input = screen.getByTestId('add-task-input');
    fireEvent.blur(input);

    // Should return to button view
    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    expect(screen.queryByTestId('add-task-input')).not.toBeInTheDocument();
  });

  it('includes required task properties when creating task', async () => {
    render(<AddTaskItem />);

    // Click add button to show form
    const addButton = screen.getByTestId('add-task-item');
    fireEvent.click(addButton);

    // Enter task name
    const input = screen.getByTestId('add-task-input');
    fireEvent.change(input, { target: { value: 'Complete Task' } });

    // Submit form
    const confirmButton = screen.getByTestId('add-task-confirm');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'Complete Task',
          status: 'todo',
          tags: [],
          dueDate: [],
          projectId: mockProjectId,
          createdAt: expect.any(String),
          modifiedAt: expect.any(String),
        }),
      );
    });
  });
});
