'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { PROJECT_DEFAULT_KEY } from '~constants/project';
import { useToast } from '~hooks/useToast';
import { useProjectStore } from '~stores/projectStore';
import { useTaskStore } from '~stores/taskStore';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AddTaskItem = () => {
  const params = useParams();
  const projectId = params.id as string;
  const { createTask } = useTaskStore();
  const { getProjectById } = useProjectStore();
  const showToast = useToast();
  const t = useTranslations('Task');

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const project = getProjectById(projectId);
  const isInitDataProject = project?.disabled === true;

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

  const handleAddTask = useCallback(
    async (name: string) => {
      if (!name) return;
      try {
        await createTask({
          title: name,
          tags: [],
          dueDate: [],
          projectId,
        });
        showToast({
          title: 'Success',
          description: t('taskCreated'),
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Error',
          description: error instanceof Error ? error.message : t('taskCreationFailed'),
          variant: 'destructive',
        });
      }
    },
    [createTask, projectId, showToast, t],
  );

  const handleStart = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setValue('');
  };

  const handleConfirm = async () => {
    if (value.trim()) {
      await handleAddTask(value.trim());
      setEditing(false);
      setValue('');
    } else {
      handleCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (editing) {
    return (
      <div className="space-y-3 p-3 border rounded-lg">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('taskTitle')}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={handleConfirm}>
            {t('addTask')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
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
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg">
      <Input
        value=""
        placeholder={t('taskTitle')}
        className="flex-1 cursor-pointer"
        onClick={handleStart}
        readOnly
      />
    </div>
  );
};

export default AddTaskItem;
