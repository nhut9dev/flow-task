'use client';

import { Folder, Forward, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { CreateProjectForm } from '~app/_components/SidebarLeft/create-project-form';
import { useFolderStore } from '~stores/folderStore';
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
  useSidebar,
} from '~ui/sidebar';

export function NavProjects({ selectedFolderId }: { selectedFolderId: string | null }) {
  const { isMobile } = useSidebar();
  const t = useTranslations('Project');
  const folders = useFolderStore((state) => state.folders);
  const projects = useProjectStore((state) => state.projects);

  const filteredProjects = useMemo(() => {
    const folderProjects = projects.filter((project) => !project.disabled && project.folderId);

    if (!selectedFolderId) return folderProjects;
    return folderProjects.filter((project) => project.folderId === selectedFolderId);
  }, [projects, selectedFolderId]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <CreateProjectForm folderId={selectedFolderId}>
          <SidebarMenuAction>
            <Plus />
            <span className="sr-only">Add Project</span>
          </SidebarMenuAction>
        </CreateProjectForm>
      </div>
      <SidebarMenu>
        {filteredProjects.map((project) => {
          const projectName = project.name.startsWith('Project.')
            ? t(project.name.replace('Project.', ''))
            : project.name;

          const folder = selectedFolderId ? null : folders.find((f) => f.id === project.folderId);
          const displayName = selectedFolderId
            ? projectName
            : `${projectName} (${folder?.name || 'Unknown'})`;

          return (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild>
                <Link href={`/projects/${project.id}`}>
                  {project.icon ? <Icon name={project.icon as any} /> : <Folder />}
                  <span>{displayName}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
