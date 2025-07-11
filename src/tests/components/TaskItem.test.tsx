import { fireEvent, render, screen } from '@testing-library/react';

import { TASK_STATUS } from '~constants/task';
import type { Task as TaskType } from '~types/task';

import Task from '../../components/TasksList/Task';

// Mock the task store
const mockUpdateTask = jest.fn();
jest.mock('~stores/taskStore', () => ({
  useTaskStore: () => ({
    updateTask: mockUpdateTask,
  }),
}));

describe('Task', () => {
  const mockTask: TaskType = {
    id: '1',
    title: 'Test Task',
    description: 'Test description',
    status: TASK_STATUS.TODO,
    projectId: 'project-1',
    createdAt: '2024-01-01',
    modifiedAt: '2024-01-01',
    dueDate: ['2024-12-31'],
    tags: ['urgent'],
  };

  const mockCompletedTask: TaskType = {
    ...mockTask,
    id: '2',
    status: TASK_STATUS.DONE,
  };

  const mockTaskWithoutDueDate: TaskType = {
    ...mockTask,
    id: '3',
    dueDate: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task with all information', () => {
    render(<Task task={mockTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText(/Due: 2024-12-31/)).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('renders completed task with correct status', () => {
    render(<Task task={mockCompletedTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('DONE')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('handles task with no due date', () => {
    render(<Task task={mockTaskWithoutDueDate} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    // When dueDate is empty array, it still shows "Due: " but without date
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.queryByText(/2024-12-31/)).not.toBeInTheDocument();
  });

  it('handles task with no tags', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };
    render(<Task task={taskWithoutTags} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('urgent')).not.toBeInTheDocument();
  });

  it('handles long task titles with truncation', () => {
    const longTitleTask = {
      ...mockTask,
      title:
        'This is a very long task title that should be truncated when it exceeds the available space',
    };
    render(<Task task={longTitleTask} />);

    expect(screen.getByText(longTitleTask.title)).toBeInTheDocument();
  });

  it('calls updateTask when checkbox is clicked', () => {
    render(<Task task={mockTask} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockUpdateTask).toHaveBeenCalledWith('1', {
      status: TASK_STATUS.DONE,
    });
  });

  it('calls updateTask with TODO when unchecking completed task', () => {
    render(<Task task={mockCompletedTask} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockUpdateTask).toHaveBeenCalledWith('2', {
      status: TASK_STATUS.TODO,
    });
  });
});
