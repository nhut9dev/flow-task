'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useProjectStore } from '~stores/projectStore';
import { useTaskStore } from '~stores/taskStore';
import { ErrorMessage } from '~ui/error-message';
import { LoadingSkeleton } from '~ui/loading-skeleton';

import AddTaskItem from './AddTask';
import TaskItem from './Task';

const TasksListWithStore = () => {
  const params = useParams();
  const projectId = params.id as string;
  const t = useTranslations('Project');
  const [isClient, setIsClient] = useState(false);

  const { loading, error, getTasksByProjectId, fetchTasksByProject, clearError } = useTaskStore();
  const { getProjectById } = useProjectStore();

  const project = getProjectById(projectId);
  const projectTasks = getTasksByProjectId(projectId) || [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (projectId && isClient) {
      fetchTasksByProject(projectId).catch(() => {
        // Error is handled by store
      });
    }
  }, [projectId, fetchTasksByProject, isClient]);

  const handleRetry = () => {
    clearError();
    if (projectId) {
      fetchTasksByProject(projectId).catch(() => {
        // Error is handled by store
      });
    }
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <AddTaskItem />
        <div className="space-y-2">
          <LoadingSkeleton lines={3} className="h-12" />
        </div>
      </div>
    );
  }

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
      {!projectTasks?.length ? (
        <div className="p-3 text-center text-muted-foreground">
          {project?.disabled ? t('noTasksMatchFilter') : t('noTasksYet')}
        </div>
      ) : (
        projectTasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TasksListWithStore;
