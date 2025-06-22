export interface Project {
  id: string;
  name: string;
  icon?: string;
  folderId?: string;
  taskIds: string[];
  disabled?: boolean;
  createdAt: string;
  modifiedAt: string;
}
