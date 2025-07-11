'use client';

import { useParams } from 'next/navigation';
import { memo } from 'react';

import { useVirtualization } from '~hooks/useVirtualization';
import { useTaskStore } from '~stores/taskStore';
import { ErrorMessage } from '~ui/error-message';
import { LoadingSkeleton } from '~ui/loading-skeleton';

import AddTaskItem from './AddTask';
import TaskItem from './Task';

const ITEM_HEIGHT = 60; // Chiều cao của mỗi task item
const CONTAINER_HEIGHT = 400; // Chiều cao của container

const TasksListVirtualized = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { loading, error, getTasksByProjectId, fetchTasksByProject, clearError } = useTaskStore();

  const projectTasks = getTasksByProjectId(projectId) || [];

  const { virtualItems, totalHeight, handleScroll } = useVirtualization(projectTasks, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 3,
  });

  const handleRetry = () => {
    clearError();
    if (projectId) {
      fetchTasksByProject(projectId).catch(() => {
        // Error is handled by store
      });
    }
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

      {!projectTasks?.length ? (
        <div className="p-3 text-center text-muted-foreground">
          No tasks yet. Create your first task above!
        </div>
      ) : (
        <div className="overflow-auto" style={{ height: CONTAINER_HEIGHT }} onScroll={handleScroll}>
          <div style={{ height: totalHeight, position: 'relative' }}>
            {virtualItems.map(({ index, offsetTop, height }) => {
              const task = projectTasks[index];
              if (!task) return null;

              return (
                <div
                  key={task.id}
                  style={{
                    position: 'absolute',
                    top: offsetTop,
                    height,
                    width: '100%',
                  }}
                >
                  <TaskItem task={task} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TasksListVirtualized);
