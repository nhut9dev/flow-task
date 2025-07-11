import { PomodoroSession, PomodoroSetting } from '~types/pomodoro';

import { ApiResponse, apiClient } from './client';

export interface CreateSessionRequest {
  taskId?: string;
  projectId?: string;
  duration: number;
  type: 'work' | 'break' | 'longBreak';
}

export interface UpdateSessionRequest {
  completed?: boolean;
  interrupted?: boolean;
  actualDuration?: number;
}

export class PomodoroApiService {
  static async getCurrentSession(): Promise<ApiResponse<PomodoroSession | null>> {
    return apiClient.get<PomodoroSession | null>('/pomodoro/current-session');
  }

  static async getPastSessions(): Promise<ApiResponse<PomodoroSession[]>> {
    return apiClient.get<PomodoroSession[]>('/pomodoro/past-sessions');
  }

  static async createSession(session: CreateSessionRequest): Promise<ApiResponse<PomodoroSession>> {
    return apiClient.post<PomodoroSession>('/pomodoro/sessions', session);
  }

  static async updateSession(
    sessionId: string,
    updates: UpdateSessionRequest,
  ): Promise<ApiResponse<PomodoroSession>> {
    return apiClient.put<PomodoroSession>(`/pomodoro/sessions/${sessionId}`, updates);
  }

  static async completeSession(sessionId: string): Promise<ApiResponse<PomodoroSession>> {
    return apiClient.put<PomodoroSession>(`/pomodoro/sessions/${sessionId}/complete`);
  }

  static async getSettings(): Promise<ApiResponse<PomodoroSetting>> {
    return apiClient.get<PomodoroSetting>('/pomodoro/settings');
  }

  static async updateSettings(
    settings: Partial<PomodoroSetting>,
  ): Promise<ApiResponse<PomodoroSetting>> {
    return apiClient.put<PomodoroSetting>('/pomodoro/settings', settings);
  }

  static async getSessionStats(period?: 'day' | 'week' | 'month'): Promise<
    ApiResponse<{
      totalSessions: number;
      totalWorkTime: number;
      totalBreakTime: number;
      completedSessions: number;
      interruptedSessions: number;
    }>
  > {
    const params = period ? { period } : undefined;
    return apiClient.get('/pomodoro/stats', params);
  }
}
