import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { POMODORO_SESSION_TYPE, POMODORO_STATUS } from '~constants/pomodoro';
import { usePomodoroStore } from '~stores/pomodoroStore';

export const usePomodoro = (seconds = 0) => {
  const {
    pomodoroStatus,
    currentSession,
    pomodoroSetting,
    startSession,
    stopSession,
    completeSession,
    setPomodoroStatus,
  } = usePomodoroStore();
  const [timeLeft, setTimeLeft] = useState(seconds);

  const isIdle = pomodoroStatus === POMODORO_STATUS.IDLE;
  const isRunning = pomodoroStatus === POMODORO_STATUS.RUNNING;
  const isPaused = pomodoroStatus === POMODORO_STATUS.PAUSED;
  const isStop =
    pomodoroStatus === POMODORO_STATUS.RUNNING || pomodoroStatus === POMODORO_STATUS.PAUSED;

  const handleStart = () => {
    const now = new Date().toISOString();
    const duration = pomodoroSetting.workDuration;
    const newSession = {
      id: uuidv4(),
      startTime: now,
      duration,
      type: POMODORO_SESSION_TYPE.FOCUS,
      completed: false,
    };

    setTimeLeft(duration);
    startSession(newSession);
  };

  const handleStop = () => {
    stopSession();
    setTimeLeft(0);
  };

  const handlePause = () => {
    setPomodoroStatus(POMODORO_STATUS.PAUSED);
  };

  const handleResume = () => {
    setPomodoroStatus(POMODORO_STATUS.RUNNING);
  };

  useEffect(() => {
    if (pomodoroStatus !== POMODORO_STATUS.RUNNING || !currentSession) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroStatus, currentSession, completeSession]);

  return {
    timeLeft,
    isIdle,
    isRunning,
    isPaused,
    isStop,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
  };
};
