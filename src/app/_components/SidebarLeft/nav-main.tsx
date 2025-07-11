'use client';

import { Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useInitStore } from '~hooks/useInitStore';
import { useProjectStore } from '~stores/projectStore';
import Icon from '~ui/icon';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~ui/sidebar';

export function NavMain() {
  const { getInitDataProjects } = useProjectStore();
  const t = useTranslations('Project');
  const [isClient, setIsClient] = useState(false);

  // Initialize projects
  useInitStore({
    fetchProjects: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('defaultProjects')}</SidebarGroupLabel>
        <SidebarMenu>{/* Empty state during SSR */}</SidebarMenu>
      </SidebarGroup>
    );
  }

  const defaultProjects = getInitDataProjects();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('defaultProjects')}</SidebarGroupLabel>
      <SidebarMenu>
        {defaultProjects.map((project) => {
          const projectName = project.name.startsWith('Project.')
            ? t(project.name.replace('Project.', ''))
            : project.name;
          return (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild>
                <Link href={`/projects/${project.id}`}>
                  {project.icon ? <Icon name={project.icon as any} /> : <Folder />}
                  <span>{projectName}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
