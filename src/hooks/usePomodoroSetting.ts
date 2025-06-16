import { POMODORO_SETTING_DEFAULT } from '~constants/pomodoro';
import { usePomodoroStore } from '~stores/pomodoroStore';

export const usePomodoroSetting = () => {
  const { pomodoroSetting, setPomodoroSetting } = usePomodoroStore();

  const handleReset = () => {
    setPomodoroSetting(POMODORO_SETTING_DEFAULT);
  };

  const handleUpdate = (values = {}) => {
    setPomodoroSetting({ ...pomodoroSetting, ...values });
  };

  return { handleReset, handleUpdate };
};
