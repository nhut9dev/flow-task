import { Task } from '~types/task';

import { ApiResponse, apiClient } from './client';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  icon?: string;
  tags: string[];
  dueDate: string[];
  projectId?: string;
  folderId?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: string;
}

export class TaskApiService {
  static async getTasks(projectId?: string): Promise<ApiResponse<Task[]>> {
    return apiClient.get<Task[]>('/tasks', { projectId });
  }

  static async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  static async createTask(task: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.post<Task>('/tasks', task);
  }

  static async updateTask(id: string, updates: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return apiClient.put<Task>(`/tasks/${id}`, updates);
  }

  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/tasks/${id}`);
  }

  static async getTasksByProject(projectId: string): Promise<ApiResponse<Task[]>> {
    return apiClient.get<Task[]>(`/projects/${projectId}/tasks`);
  }

  static async getTasksByFolder(folderId: string): Promise<ApiResponse<Task[]>> {
    return apiClient.get<Task[]>(`/folders/${folderId}/tasks`);
  }
}
