export interface Project {
  id: string;
  name: string;
  icon?: string;
  folderId?: string | null;
  taskIds: string[];
  dueDate: string[];
  disabled?: boolean;
  createdAt: string;
  modifiedAt: string;
}
