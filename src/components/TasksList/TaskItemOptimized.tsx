'use client';

import { memo, useCallback, useMemo, useState } from 'react';

import { useDebouncedCallback } from '~hooks/useMemoizedCallback';
import { useTaskStore } from '~stores/taskStore';
import { Task } from '~types/task';
import { Button } from '~ui/button';
import { Checkbox } from '~ui/checkbox';
import { LoadingSpinner } from '~ui/loading-spinner';

interface TaskItemOptimizedProps {
  task: Task;
}

const TaskItemOptimized = memo<TaskItemOptimizedProps>(({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [isEditing, setIsEditing] = useState(false);

  const { updateTask, deleteTask, loading } = useTaskStore();

  // Debounced update để tránh gọi API quá nhiều khi user đang type
  const debouncedUpdate = useDebouncedCallback(
    async (updates: Partial<Task>) => {
      try {
        await updateTask(task.id, updates);
      } catch {
        // Error handled by store
      }
    },
    500,
    [task.id, updateTask],
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setLocalTitle(newTitle);
      debouncedUpdate({ title: newTitle });
    },
    [debouncedUpdate],
  );

  const handleStatusChange = useCallback(
    async (checked: boolean) => {
      const newStatus = checked ? 'done' : 'todo';
      try {
        await updateTask(task.id, { status: newStatus });
      } catch {
        // Error handled by store
      }
    },
    [task.id, updateTask],
  );

  const handleDelete = useCallback(async () => {
    try {
      await deleteTask(task.id);
    } catch {
      // Error handled by store
    }
  }, [task.id, deleteTask]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Memoize computed values
  const isCompleted = useMemo(() => task.status === 'done', [task.status]);
  const formattedDate = useMemo(() => {
    if (!task.dueDate?.length) return null;
    return new Date(task.dueDate[0]).toLocaleDateString();
  }, [task.dueDate]);

  const taskClassName = useMemo(() => {
    const baseClasses = 'flex items-center gap-3 p-3 border rounded-lg transition-all';
    return `${baseClasses} ${isCompleted ? 'bg-muted/50 opacity-75' : 'bg-background'}`;
  }, [isCompleted]);

  return (
    <div className={taskClassName}>
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleStatusChange}
        disabled={loading}
        className="flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={stopEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter') stopEditing();
                if (e.key === 'Escape') {
                  setLocalTitle(task.title);
                  stopEditing();
                }
              }}
              className="flex-1 px-2 py-1 border rounded text-sm"
              autoFocus
            />
          ) : (
            <h3
              className={`flex-1 text-sm font-medium truncate cursor-pointer ${
                isCompleted ? 'line-through text-muted-foreground' : ''
              }`}
              onClick={startEditing}
              title={task.title}
            >
              {task.title}
            </h3>
          )}

          {loading && <LoadingSpinner size="sm" />}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
        )}

        {(task.tags?.length > 0 || formattedDate) && (
          <div className="flex items-center gap-2 mt-2">
            {task.tags?.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                {tag}
              </span>
            ))}
            {formattedDate && (
              <span className="text-xs text-muted-foreground">Due: {formattedDate}</span>
            )}
          </div>
        )}

        {isExpanded && task.description && (
          <div className="mt-2 p-2 bg-muted/30 rounded text-xs">{task.description}</div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {task.description && (
          <Button variant="ghost" size="sm" onClick={toggleExpanded} className="h-6 w-6 p-0">
            {isExpanded ? '−' : '+'}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
        >
          ×
        </Button>
      </div>
    </div>
  );
});

TaskItemOptimized.displayName = 'TaskItemOptimized';

export default TaskItemOptimized;
