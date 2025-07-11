import { render, screen } from '@testing-library/react';

import { TASK_STATUS } from '~constants/task';
import type { Task as TaskType } from '~types/task';

import TasksList from '../../components/TasksList';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-project-id' }),
}));

// Mock the task store
const mockGetTasksByProjectId = jest.fn();
jest.mock('~stores/taskStore', () => ({
  useTaskStore: () => ({
    getTasksByProjectId: mockGetTasksByProjectId,
  }),
}));

describe('TasksList', () => {
  const mockTasks: TaskType[] = [
    {
      id: '1',
      title: 'First Task',
      description: 'First task description',
      status: TASK_STATUS.TODO,
      projectId: 'test-project-id',
      createdAt: '2024-01-01',
      modifiedAt: '2024-01-01',
      dueDate: ['2024-12-31'],
      tags: ['urgent'],
    },
    {
      id: '2',
      title: 'Second Task',
      description: 'Second task description',
      status: TASK_STATUS.DONE,
      projectId: 'test-project-id',
      createdAt: '2024-01-01',
      modifiedAt: '2024-01-01',
      dueDate: [],
      tags: ['frontend'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTasksByProjectId.mockReturnValue(mockTasks);
  });

  it('renders list of tasks', () => {
    render(<TasksList />);

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('DONE')).toBeInTheDocument();
  });

  it('displays due dates for tasks that have them', () => {
    render(<TasksList />);

    const dueDateElements = screen.getAllByText(/Due:/);
    expect(dueDateElements).toHaveLength(2);
    expect(screen.getByText(/2024-12-31/)).toBeInTheDocument();
  });

  it('displays tags for tasks', () => {
    render(<TasksList />);

    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    mockGetTasksByProjectId.mockReturnValue([]);
    render(<TasksList />);

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('renders AddTask component', () => {
    render(<TasksList />);

    expect(screen.getByTestId('add-task-item')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('handles task status changes', async () => {
    render(<TasksList />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);

    // First task should be unchecked (TODO)
    expect(checkboxes[0]).not.toBeChecked();
    // Second task should be checked (DONE)
    expect(checkboxes[1]).toBeChecked();
  });

  it('renders correct number of tasks', () => {
    render(<TasksList />);

    // Get only the actual task titles, not the "Add Task" button
    const taskTitles = screen.getAllByText(/^(First|Second) Task$/);
    expect(taskTitles).toHaveLength(2);
  });
});
