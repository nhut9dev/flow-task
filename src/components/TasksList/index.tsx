'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useInitStore } from '~hooks/useInitStore';
import { useProjectStore } from '~stores/projectStore';
import { useTaskStore } from '~stores/taskStore';

import AddTaskItem from './AddTask';
import Task from './Task';

const TasksList = () => {
  const params = useParams();
  const projectId = params.id as string;
  const t = useTranslations('Project');
  const [isClient, setIsClient] = useState(false);

  const { getTasksByProjectId, getAllTasks } = useTaskStore();
  const { getProjectById } = useProjectStore();

  const project = getProjectById(projectId);

  // For initData projects, we need all tasks for filtering
  const allTasks = getAllTasks();
  const projectTasks = project?.disabled
    ? getTasksByProjectId(projectId)
    : allTasks.filter((task) => task.projectId === projectId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize task store with API data
  useInitStore({
    fetchTasks: true,
    projectId,
  });

  if (!isClient) {
    return (
      <div className="space-y-1">
        <AddTaskItem />
        <div className="p-3 text-center text-muted-foreground">
          {/* Loading state during SSR */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AddTaskItem />
      {!projectTasks?.length ? (
        <div className="p-3 text-center text-muted-foreground">
          {project?.disabled ? t('noTasksMatchFilter') : t('noTasks')}
        </div>
      ) : (
        projectTasks?.map((task) => <Task key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TasksList;
