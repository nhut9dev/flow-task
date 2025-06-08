export interface Project {
  id: string;
  name: string;
  folderId?: string;
  taskIds: string[];
  createdAt: string;
  modifiedAt: string;
}
