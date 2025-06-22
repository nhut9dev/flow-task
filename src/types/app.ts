import { icons } from 'lucide-react';

import { Theme } from '~constants/theme';
import { Folder } from '~types/folder';
import { PomodoroSession, PomodoroSetting } from '~types/pomodoro';
import { Project } from '~types/project';
import { Task } from '~types/task';

export type IconName = keyof typeof icons;

export interface AppSetting {
  theme: Theme;
  showCompletedTasks: boolean;
  favoriteIcons: IconName[];
  recentIcons: IconName[];
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  folders: Folder[];
  pomodoroSessions: PomodoroSession[];
  pomodoroSetting: PomodoroSetting;
  appSettings: AppSetting;
}
