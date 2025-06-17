import Pomodoro from '~components/Pomodoro';
import PomodoroSetting from '~components/PomodoroSetting';

export default function Home() {
  return (
    <div className="p-4">
      <Pomodoro />
      <PomodoroSetting />
    </div>
  );
}
