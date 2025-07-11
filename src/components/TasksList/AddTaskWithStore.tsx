'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { TASK_STATUS } from '~constants/task';
import { CreateTaskInput, createTaskSchema } from '~lib/validation/schemas';
import { useTaskStore } from '~stores/taskStore';
import { Button } from '~ui/button';
import { ErrorMessage } from '~ui/error-message';
import { Input } from '~ui/input';
import { LoadingSpinner } from '~ui/loading-spinner';

const AddTaskWithStore = () => {
  const params = useParams();
  const projectId = params.id as string;
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      dueDate: [],
      projectId,
    },
  });

  const { loading, error, createTask, clearError } = useTaskStore();

  const onSubmit = useCallback(
    async (data: CreateTaskInput) => {
      try {
        await createTask({
          ...data,
          projectId,
          status: TASK_STATUS.TODO,
        });

        reset();
        setEditing(false);
        clearError();
      } catch {
        // Error is handled by store
      }
    },
    [createTask, projectId, reset, clearError],
  );

  const handleStart = () => {
    setEditing(true);
    clearError();
  };

  const handleCancel = () => {
    setEditing(false);
    reset();
    clearError();
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

        {error && <ErrorMessage error={error} onDismiss={clearError} />}

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

export default AddTaskWithStore;
