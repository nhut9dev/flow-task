'use client';

import { Folder, Forward, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { CreateProjectForm } from '~app/_components/SidebarLeft/create-project-form';
import { useInitStore } from '~hooks/useInitStore';
import { useProjectStore } from '~stores/projectStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~ui/dropdown-menu';
import Icon from '~ui/icon';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~ui/sidebar';

export function NavProjects({ selectedFolderId }: { selectedFolderId: string | null }) {
  const { getRegularProjects } = useProjectStore();
  const t = useTranslations('Project');
  const tTask = useTranslations('Task');
  const [isClient, setIsClient] = useState(false);

  // Initialize projects based on selected folder
  useInitStore({
    fetchProjects: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!isClient) return [];

    const regularProjects = getRegularProjects();

    if (!selectedFolderId) return regularProjects;
    return regularProjects.filter((project) => project.folderId === selectedFolderId);
  }, [getRegularProjects, selectedFolderId, isClient]);

  const handleDeleteProject = async (projectId: string) => {
    // TODO: Implement delete project functionality
    console.log('Delete project:', projectId);
  };

  if (!isClient) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
        <SidebarMenu>{/* Empty state during SSR */}</SidebarMenu>
      </SidebarGroup>
    );
  }

  if (!filteredProjects?.length) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>{t('noProjectsYet')}</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredProjects.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${project.id}`}>
                {project.icon ? <Icon name={project.icon as any} /> : <Folder />}
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
                    <MoreHorizontal className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/${project.id}`}>
                      <Forward className="mr-2 h-4 w-4" />
                      {tTask('open')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {tTask('delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <CreateProjectForm folderId={selectedFolderId}>
            <SidebarMenuButton>
              <Plus />
              <span>{t('addProject')}</span>
            </SidebarMenuButton>
          </CreateProjectForm>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
