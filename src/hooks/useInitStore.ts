import { useEffect } from 'react';

import { PROJECT_DEFAULT_DATA } from '~constants/project';
import { PROJECT_STORAGE_NAME, useProjectStore } from '~stores/projectStore';

export const useInitProjectStore = () => {
  const setProjects = useProjectStore((state) => state.setProjects);

  useEffect(() => {
    const saved = localStorage.getItem(PROJECT_STORAGE_NAME);
    if (!saved || saved === '{}') {
      setProjects(PROJECT_DEFAULT_DATA);
    }
  }, []);
};
