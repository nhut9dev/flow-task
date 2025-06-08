import { TaskStatus } from '~constants/task';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags: string[];
  projectId?: string;
  folderId?: string;
  createdAt: string;
  modifiedAt: string;
}
