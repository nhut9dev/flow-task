'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { useApi } from '~hooks/useApi';
import { TaskApiService } from '~lib/api/tasks';
import { Task } from '~types/task';
import { ErrorMessage } from '~ui/error-message';
import { LoadingSkeleton } from '~ui/loading-skeleton';

import AddTaskItem from './AddTask';
import TaskItem from './Task';

const TasksListEnhanced = () => {
  const params = useParams();
  const projectId = params.id as string;

  const {
    data: tasks,
    loading,
    error,
    execute: fetchTasks,
    reset: resetTasks,
  } = useApi<Task[]>(() => TaskApiService.getTasksByProject(projectId), []);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, fetchTasks]);

  const handleRetry = () => {
    resetTasks();
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <AddTaskItem />
        <div className="space-y-2">
          <LoadingSkeleton lines={3} className="h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <AddTaskItem />
        <ErrorMessage error={error} onRetry={handleRetry} className="mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AddTaskItem />
      {!tasks?.length ? (
        <div className="p-3 text-center text-muted-foreground">
          No tasks yet. Create your first task above!
        </div>
      ) : (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TasksListEnhanced;
