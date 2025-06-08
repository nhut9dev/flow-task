'use client';

import { useTranslations } from 'next-intl';

import { usePomodoro } from '~hooks/usePomodoro';
import { formatTime } from '~utils/time';

const Pomodoro = () => {
  const t = useTranslations('Pomodoro');
  const {
    timeLeft,
    isIdle,
    isRunning,
    isPaused,
    isStop,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
  } = usePomodoro(0);

  return (
    <div className="p-4 border rounded-lg shadow-md w-full max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-2">Pomodoro Timer</h2>

      <div className="text-4xl font-mono mb-4">{formatTime(timeLeft)}</div>

      {isIdle && (
        <button onClick={handleStart} className="btn-primary">
          {t('start')}
        </button>
      )}

      {isRunning && (
        <button onClick={handlePause} className="btn-warning">
          {t('pause')}
        </button>
      )}

      {isPaused && (
        <button onClick={handleResume} className="btn-primary">
          {t('resume')}
        </button>
      )}

      {isStop && (
        <button onClick={handleStop} className="btn-danger ml-2">
          {t('stop')}
        </button>
      )}
    </div>
  );
};

export default Pomodoro;
