import { PomodoroSessionType } from '~constants/pomodoro';

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  type: PomodoroSessionType;
  completed: boolean;
}

export interface PomodoroSetting {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartPomodoro: boolean;
  autoStartBreak: boolean;
  sound: {
    focus: string;
    break: string;
  };
}
