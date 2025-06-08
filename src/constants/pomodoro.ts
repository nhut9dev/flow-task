export const POMODORO_SETTING_DEFAULT = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  longBreakInterval: 4,
  autoStartPomodoro: true,
  autoStartBreak: true,
  sound: {
    focus: 'focus.mp3',
    break: 'break.mp3',
  },
};

export const POMODORO_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  BREAK: 'break',
} as const;

export type PomodoroStatus = (typeof POMODORO_STATUS)[keyof typeof POMODORO_STATUS];

export const POMODORO_SESSION_TYPE = {
  FOCUS: 'focus',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
} as const;

export type PomodoroSessionType =
  (typeof POMODORO_SESSION_TYPE)[keyof typeof POMODORO_SESSION_TYPE];
