export interface Project {
  id: string;
  name: string;
  folderId?: string;
  taskIds: string[];
  disabled?: boolean;
  createdAt: string;
  modifiedAt: string;
}
