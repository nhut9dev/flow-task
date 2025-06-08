import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PomodoroSession, PomodoroSetting } from '~/types';
import { POMODORO_SETTING_DEFAULT, POMODORO_STATUS, PomodoroStatus } from '~constants/pomodoro';

interface PomodoroState {
  pomodoroStatus: PomodoroStatus;
  currentSession: PomodoroSession | null;
  pastSessions: PomodoroSession[];
  pomodoroSetting: PomodoroSetting;

  startSession: (session: PomodoroSession) => void;
  stopSession: () => void;
  completeSession: () => void;
  setPomodoroStatus: (status: PomodoroStatus) => void;
  setPomodoroSetting: (setting: PomodoroSetting) => void;
}

export const POMODORO_STORAGE_NAME = 'pomodoro_storage';

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      pomodoroStatus: POMODORO_STATUS.IDLE,
      currentSession: null,
      pastSessions: [],
      pomodoroSetting: POMODORO_SETTING_DEFAULT,

      startSession: (session) => {
        set({
          currentSession: session,
          pomodoroStatus: POMODORO_STATUS.RUNNING,
        });
      },

      stopSession: () => {
        set({
          currentSession: null,
          pomodoroStatus: POMODORO_STATUS.IDLE,
        });
      },

      completeSession: () => {
        const session = get().currentSession;
        if (session) {
          set((state) => ({
            pastSessions: [...state.pastSessions, { ...session, completed: true }],
            currentSession: null,
            pomodoroStatus: POMODORO_STATUS.IDLE,
          }));
        }
      },

      setPomodoroStatus: (status) => set({ pomodoroStatus: status }),
      setPomodoroSetting: (setting) => set({ pomodoroSetting: setting }),
    }),
    {
      name: POMODORO_STORAGE_NAME,
    },
  ),
);
