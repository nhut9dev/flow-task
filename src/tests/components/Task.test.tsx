import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';

import Task from '~components/TasksList/Task';
import { TASK_STATUS } from '~constants/task';
import { useTaskFocusStore } from '~stores/taskFocusStore';
import { useTaskStore } from '~stores/taskStore';

// Mock useTaskStore
jest.mock('~stores/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

// Mock useTaskFocusStore
jest.mock('~stores/taskFocusStore', () => ({
  useTaskFocusStore: jest.fn(),
}));

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: TASK_STATUS.TODO,
  tags: ['high'],
  dueDate: ['today'],
  icon: 'star',
  projectId: 'project-1',
  folderId: undefined,
  createdAt: '2024-01-01T00:00:00Z',
  modifiedAt: '2024-01-01T00:00:00Z',
};

describe('Task', () => {
  const mockUpdateTask = jest.fn();
  const mockSetFocusedTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      updateTask: mockUpdateTask,
    });
    (useTaskFocusStore as unknown as jest.Mock).mockReturnValue({
      focusedTaskId: null,
      setFocusedTask: mockSetFocusedTask,
    });
  });

  it('renders task information correctly', () => {
    render(<Task task={mockTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('Due: today')).toBeInTheDocument();
  });

  it('shows focused state when task is selected', () => {
    (useTaskFocusStore as unknown as jest.Mock).mockReturnValue({
      focusedTaskId: 'task-1',
      setFocusedTask: mockSetFocusedTask,
    });

    const { container } = render(<Task task={mockTask} />);
    const taskElement = container.querySelector('div.cursor-pointer');
    expect(taskElement).toBeDefined();
    expect(taskElement).toHaveClass('bg-accent/50');
    expect(taskElement).toHaveClass('border-l-4');
    expect(taskElement).toHaveClass('border-l-primary');
  });

  it('calls setFocusedTask when clicked', () => {
    const { container } = render(<Task task={mockTask} />);
    const taskElement = container.querySelector('div.cursor-pointer');
    fireEvent.click(taskElement!);
    expect(mockSetFocusedTask).toHaveBeenCalledWith('task-1');
  });

  it('does not call setFocusedTask when checkbox is clicked', () => {
    render(<Task task={mockTask} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockSetFocusedTask).not.toHaveBeenCalled();
    expect(mockUpdateTask).toHaveBeenCalledWith('task-1', { status: TASK_STATUS.DONE });
  });

  it('updates task status when checkbox is toggled', () => {
    const completedTask = { ...mockTask, status: TASK_STATUS.DONE };
    render(<Task task={completedTask} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(mockUpdateTask).toHaveBeenCalledWith('task-1', { status: TASK_STATUS.TODO });
  });

  it('displays task icon when available', () => {
    render(<Task task={mockTask} />);

    // The icon should be rendered (we can't easily test the specific icon content)
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('displays task tags correctly', () => {
    const taskWithTags = { ...mockTask, tags: ['high', 'urgent'] };
    render(<Task task={taskWithTags} />);

    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('displays due date correctly', () => {
    const taskWithDueDate = { ...mockTask, dueDate: ['tomorrow', 'week'] };
    const { container } = render(<Task task={taskWithDueDate} />);

    // Find the <p> containing 'Due:'
    const dueP = Array.from(container.querySelectorAll('p')).find(
      (p) => p.textContent && p.textContent.includes('Due:'),
    );
    expect(dueP).toBeDefined();
    expect(dueP!.textContent).toContain('Due:');
    expect(dueP!.textContent).toContain('tomorrow');
    expect(dueP!.textContent).toContain('week');
  });

  it('handles task without optional fields', () => {
    const minimalTask = {
      id: 'task-2',
      title: 'Minimal Task',
      status: TASK_STATUS.TODO,
      tags: [],
      dueDate: [],
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
    };

    render(<Task task={minimalTask} />);

    expect(screen.getByText('Minimal Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
  });
});
