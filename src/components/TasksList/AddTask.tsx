'use client';

import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useToast } from '~hooks/useToast';
import { useTaskStore } from '~stores/taskStore';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AddTaskItem = () => {
  const params = useParams();
  const projectId = params.id as string;
  const { createTask } = useTaskStore();
  const showToast = useToast();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

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
          description: 'Task created successfully',
          variant: 'success',
        });
      } catch (error) {
        showToast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create task',
          variant: 'destructive',
        });
      }
    },
    [createTask, projectId, showToast],
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
    <div className="flex items-center gap-2 p-3 border-b bg-accent/10 rounded">
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleConfirm}
        placeholder="Task name"
        className="flex-1"
        data-testid="add-task-input"
      />
      <Button size="sm" variant="default" onClick={handleConfirm} data-testid="add-task-confirm">
        OK
      </Button>
      <Button size="sm" variant="outline" onClick={handleCancel} data-testid="add-task-cancel">
        Cancel
      </Button>
    </div>
  );
};

export default AddTaskItem;
