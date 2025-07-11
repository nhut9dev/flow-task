import { Project } from '~types/project';

import { ApiResponse, apiClient } from './client';

export interface CreateProjectRequest {
  name: string;
  icon?: string;
  folderId?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  taskIds?: string[];
}

export class ProjectApiService {
  static async getProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get<Project[]>('/projects');
  }

  static async getProjectById(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`/projects/${id}`);
  }

  static async createProject(project: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return apiClient.post<Project>('/projects', project);
  }

  static async updateProject(
    id: string,
    updates: UpdateProjectRequest,
  ): Promise<ApiResponse<Project>> {
    return apiClient.put<Project>(`/projects/${id}`, updates);
  }

  static async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/projects/${id}`);
  }

  static async getProjectsByFolder(folderId: string): Promise<ApiResponse<Project[]>> {
    return apiClient.get<Project[]>(`/folders/${folderId}/projects`);
  }
}
