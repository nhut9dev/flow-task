import { TaskStatus } from '~constants/task';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags: string[];
  dueDate: string;
  projectId?: string;
  folderId?: string;
  createdAt: string;
  modifiedAt: string;
}
