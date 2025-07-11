import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import SidebarRight from '~app/_components/SidebarRight';
import { TASK_STATUS } from '~constants/task';
import { useTaskFocusStore } from '~stores/taskFocusStore';
import { useTaskStore } from '~stores/taskStore';
import { SidebarProvider } from '~ui/sidebar';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => (key: string) => mockTranslations[key] || key),
}));

// Mock useToast
jest.mock('~hooks/useToast', () => ({
  useToast: jest.fn(() => jest.fn()),
}));

// Mock useTaskStore
jest.mock('~stores/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

// Mock useTaskFocusStore
jest.mock('~stores/taskFocusStore', () => ({
  useTaskFocusStore: jest.fn(),
}));

// Mock window.matchMedia for Jest environment
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: TASK_STATUS.TODO,
  tags: ['high'],
  dueDate: ['today'],
  icon: 'star',
  projectId: 'project-1',
  folderId: null,
  createdAt: '2024-01-01T00:00:00Z',
  modifiedAt: '2024-01-01T00:00:00Z',
};

const mockTranslations: Record<string, string> = {
  'Task.taskTitle': 'Task Title',
  'Task.taskDescription': 'Task Description',
  'Task.taskUpdated': 'Task updated successfully',
  'Task.taskUpdateFailed': 'Failed to update task',
  'Task.taskDeleted': 'Task deleted successfully',
  'Task.taskDeleteFailed': 'Failed to delete task',
  'Task.dueDate': 'Due Date',
  'Task.tags': 'Tags',
  'Task.taskInfo': 'Task Information',
  'Task.createdAt': 'Created',
  'Task.modifiedAt': 'Modified',
  'Task.projectId': 'Project ID',
  'Task.noDueDate': 'No due date set',
  'Task.noTags': 'No tags set',
  'Task.delete': 'Delete',
  'Status.status': 'Status',
  'Status.todo': 'To Do',
  'Status.inProgress': 'In Progress',
  'Status.done': 'Done',
  'Project.icon': 'Icon',
  'Project.today': 'Today',
  'Project.tomorrow': 'Tomorrow',
  'Project.thisWeek': 'This Week',
  'Priority.high': 'High',
  'Priority.medium': 'Medium',
  'Priority.low': 'Low',
  'Priority.urgent': 'Urgent',
  'Common.cancel': 'Cancel',
};

describe('SidebarRight', () => {
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockSetFocusedTask = jest.fn();
  const mockClearFocus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslations as jest.Mock).mockReturnValue((key: string) => mockTranslations[key] || key);
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [mockTask],
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    });
    (useTaskFocusStore as unknown as jest.Mock).mockReturnValue({
      focusedTaskId: 'task-1',
      setFocusedTask: mockSetFocusedTask,
      clearFocus: mockClearFocus,
    });
  });

  it('renders task information when task is focused', () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('does not render when no task is focused', () => {
    (useTaskFocusStore as unknown as jest.Mock).mockReturnValue({
      focusedTaskId: null,
      setFocusedTask: mockSetFocusedTask,
      clearFocus: mockClearFocus,
    });

    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
  });

  it('does not render when task is not found', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    });

    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
  });

  it('allows editing task title', async () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Find and update title input
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({
          title: 'Updated Task',
        }),
      );
    });
  });

  it('allows editing task description', async () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Find and update description textarea
    const descriptionTextarea = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({
          description: 'Updated Description',
        }),
      );
    });
  });

  it('allows editing task status', async () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Find and update status select
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.click(statusSelect);

    // Select "In Progress" option
    const inProgressOption = screen.getByText('In Progress');
    fireEvent.click(inProgressOption);

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        'task-1',
        expect.objectContaining({
          status: TASK_STATUS.IN_PROGRESS,
        }),
      );
    });
  });

  it('allows deleting task', async () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
      expect(mockClearFocus).toHaveBeenCalled();
    });
  });

  it('cancels editing when cancel button is clicked', () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Verify edit mode is active
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Verify edit mode is cancelled
    expect(screen.queryByDisplayValue('Test Task')).not.toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('closes sidebar when close button is clicked', () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockClearFocus).toHaveBeenCalled();
  });

  it('displays task metadata correctly', () => {
    render(
      <SidebarProvider>
        <SidebarRight />
      </SidebarProvider>,
    );

    expect(screen.getByText(/Created/)).toBeInTheDocument();
    expect(screen.getByText(/Modified/)).toBeInTheDocument();
    expect(screen.getByText(/Project ID/)).toBeInTheDocument();
  });
});
