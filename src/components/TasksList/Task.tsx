'use client';

import { TASK_STATUS } from '~constants/task';
import { useAction } from '~hooks/useAction';
import { useTaskStore } from '~stores/taskStore';
import type { Task as TaskType } from '~types/task';

import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import Icon from '../ui/icon';
import { Muted, Small } from '../ui/typography';

interface TaskProps {
  task: TaskType;
}

function Task({ task }: TaskProps) {
  const { updateTask } = useTaskStore();
  const { setFocusedTask, taskId } = useAction();

  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent click when clicking on checkbox
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    setFocusedTask(task.id);
  };

  const isFocused = taskId === task.id;

  return (
    <div
      className={`flex items-center gap-3 p-3 border-b hover:bg-accent/30 transition group cursor-pointer ${
        isFocused ? 'bg-accent/50 border-l-4 border-l-primary' : ''
      }`}
      onClick={handleTaskClick}
    >
      <Checkbox
        checked={task.status === TASK_STATUS.DONE}
        onCheckedChange={(checked) =>
          updateTask(task.id, { status: checked ? TASK_STATUS.DONE : TASK_STATUS.TODO })
        }
      />
      {task.icon && <Icon name={task.icon as any} className="w-5 h-5 text-muted-foreground" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Small className="truncate font-medium">{task.title}</Small>
          {task.status && (
            <Badge
              variant={
                task.status === TASK_STATUS.DONE
                  ? 'secondary'
                  : task.status === TASK_STATUS.IN_PROGRESS
                    ? 'outline'
                    : undefined
              }
            >
              {task.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {task.dueDate && <Muted>Due: {task.dueDate}</Muted>}
          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Task;
