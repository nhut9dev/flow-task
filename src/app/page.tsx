import PomodoroSetting from '~app/settings/_components/PomodoroSettings';
import Pomodoro from '~components/Pomodoro';

export default function Home() {
  return (
    <div className="p-4">
      <Pomodoro />
      <PomodoroSetting />
      <div className="flex"></div>
    </div>
  );
}
