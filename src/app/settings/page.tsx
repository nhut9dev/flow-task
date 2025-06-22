'use client';

import { useState } from 'react';

import GeneralSetting from './_components/GeneralSettings';
import PomodoroSettings from './_components/PomodoroSettings';
import SettingsItem from './_components/SettingsItem';

const SECTION = {
  GENERAL: 'general',
  POMODORO: 'pomodoro',
};

const Settings = () => {
  const [collapseKeys, setCollapseKeys] = useState<any>([SECTION.GENERAL, SECTION.POMODORO]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-3xl space-y-4">
        <SettingsItem
          title="General"
          open={collapseKeys.includes(SECTION.GENERAL)}
          onOpenChange={(open) =>
            setCollapseKeys((prev: any) =>
              open
                ? [...prev, SECTION.GENERAL]
                : prev.filter((key: any) => key !== SECTION.GENERAL),
            )
          }
        >
          <GeneralSetting />
        </SettingsItem>

        <hr className="w-full h-0.5 border-dashed" />

        <SettingsItem
          title="Pomodoro"
          open={collapseKeys.includes(SECTION.POMODORO)}
          onOpenChange={(open) =>
            setCollapseKeys((prev: any) =>
              open
                ? [...prev, SECTION.POMODORO]
                : prev.filter((key: any) => key !== SECTION.POMODORO),
            )
          }
        >
          <PomodoroSettings />
        </SettingsItem>
      </div>
    </div>
  );
};

export default Settings;
