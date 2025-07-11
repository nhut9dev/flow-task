'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import TasksList from '~components/TasksList';
import { useInitStore } from '~hooks/useInitStore';
import { useProjectStore } from '~stores/projectStore';

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const { getProjectById } = useProjectStore();
  const t = useTranslations('Project');
  const [isClient, setIsClient] = useState(false);

  // Initialize stores with API data
  useInitStore({
    fetchProjects: true,
    fetchTasks: true,
    projectId,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <span className="text-sm">📁</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Loading...</h1>
          </div>
        </div>
        <TasksList />
      </div>
    );
  }

  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('projectNotFound')}</p>
      </div>
    );
  }

  const projectName = project.name.startsWith('Project.')
    ? t(project.name.replace('Project.', ''))
    : project.name;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {project.icon ? (
          <span className="text-2xl">{project.icon}</span>
        ) : (
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <span className="text-sm">📁</span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{projectName}</h1>
          {project.disabled && (
            <p className="text-sm text-muted-foreground">{t('filterViewDescription')}</p>
          )}
        </div>
      </div>
      <TasksList />
    </div>
  );
}
