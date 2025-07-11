'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PROJECT_DEFAULT_KEY } from '~constants/project';
import { TASK_STATUS } from '~constants/task';
import { useApi } from '~hooks/useApi';
import { TaskApiService } from '~lib/api/tasks';
import { useProjectStore } from '~stores/projectStore';
import { Button } from '~ui/button';
import { ErrorMessage } from '~ui/error-message';
import { Input } from '~ui/input';
import { LoadingSpinner } from '~ui/loading-spinner';

// Form schema for AddTaskEnhanced
const addTaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type AddTaskFormData = z.infer<typeof addTaskFormSchema>;

const AddTaskEnhanced = () => {
  const params = useParams();
  const projectId = params.id as string;
  const [editing, setEditing] = useState(false);

  const { getProjectById } = useProjectStore();
  const project = getProjectById(projectId);
  const isInitDataProject = project?.disabled === true;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    loading,
    error,
    execute: createTask,
    reset: resetApi,
  } = useApi(() => TaskApiService.createTask({} as any));

  // Get auto-assigned info for initData projects
  const getAutoAssignedInfo = () => {
    if (!isInitDataProject) return null;

    switch (projectId) {
      case PROJECT_DEFAULT_KEY.TODAY:
        return { dueDate: 'Hôm nay', tags: [] };
      case PROJECT_DEFAULT_KEY.TOMORROW:
        return { dueDate: 'Ngày mai', tags: [] };
      case PROJECT_DEFAULT_KEY.THIS_WEEK:
        return { dueDate: 'Cuối tuần này', tags: [] };
      case PROJECT_DEFAULT_KEY.HIGH_PRIORITY:
        return { dueDate: 'Không có', tags: ['high-priority'] };
      case PROJECT_DEFAULT_KEY.MEDIUM_PRIORITY:
        return { dueDate: 'Không có', tags: ['medium-priority'] };
      case PROJECT_DEFAULT_KEY.LOW_PRIORITY:
        return { dueDate: 'Không có', tags: ['low-priority'] };
      case PROJECT_DEFAULT_KEY.PLANNED:
        return { dueDate: 'Cuối tuần tới', tags: [] };
      case PROJECT_DEFAULT_KEY.BACKLOG:
        return { dueDate: 'Không có', tags: [] };
      case PROJECT_DEFAULT_KEY.COMPLETED:
        return { dueDate: 'Không có', tags: [] };
      default:
        return null;
    }
  };

  const autoAssignedInfo = getAutoAssignedInfo();

  const onSubmit = useCallback(
    async (data: AddTaskFormData) => {
      try {
        await createTask({
          title: data.title,
          description: data.description || '',
          tags: [],
          dueDate: [],
          projectId,
          status: TASK_STATUS.TODO,
        });

        reset();
        setEditing(false);
        resetApi();
      } catch {
        // Error is handled by useApi hook
      }
    },
    [createTask, projectId, reset, resetApi],
  );

  const handleStart = () => {
    setEditing(true);
    resetApi();
  };

  const handleCancel = () => {
    setEditing(false);
    reset();
    resetApi();
  };

  if (!editing) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2 p-3 border-b text-muted-foreground hover:bg-accent/20 transition rounded"
        onClick={handleStart}
        data-testid="add-task-item"
      >
        <span className="text-lg font-semibold">＋</span>
        <span>Add Task</span>
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('title')}
            placeholder="Task title"
            className={errors.title ? 'border-destructive' : ''}
            disabled={loading}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Input
            {...register('description')}
            placeholder="Task description (optional)"
            className={errors.description ? 'border-destructive' : ''}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
          )}
        </div>

        {autoAssignedInfo && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
            <div className="font-medium mb-1">Tự động gán:</div>
            <div>📅 Due date: {autoAssignedInfo.dueDate}</div>
            {autoAssignedInfo.tags.length > 0 && (
              <div>🏷️ Tags: {autoAssignedInfo.tags.join(', ')}</div>
            )}
          </div>
        )}

        {error && <ErrorMessage error={error} onDismiss={resetApi} />}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading && <LoadingSpinner size="sm" />}
            Add Task
          </Button>

          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskEnhanced;
