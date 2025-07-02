'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useTaskStore } from '~stores/taskStore';

import AddTaskItem from './AddTask';
import Task from './Task';

const TasksList = () => {
  const params = useParams();
  const projectId = params.id as string;

  const { getTasksByProjectId } = useTaskStore();
  const tasks = getTasksByProjectId(projectId);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-1">
      <AddTaskItem />
      {!tasks.length ? (
        <div className="p-3 text-center text-muted-foreground">No tasks yet</div>
      ) : (
        tasks.map((task) => <Task key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TasksList;
