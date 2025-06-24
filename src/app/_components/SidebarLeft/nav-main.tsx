'use client';

import { Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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
  const projects = useProjectStore((state) => state.projects);
  const t = useTranslations('Project');

  const defaultProjects = projects.filter((project) => project.disabled);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Default Projects</SidebarGroupLabel>
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
