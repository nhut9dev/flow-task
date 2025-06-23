'use client';

import { Folder, Forward, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

import { CreateProjectForm } from '~app/_components/SidebarLeft/create-project-form';
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

export function NavProjects({
  projects,
  selectedFolderId,
}: {
  projects: import('~types/project').Project[];
  selectedFolderId: string | null;
}) {
  const { isMobile } = useSidebar();

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
        {projects.map((project) => {
          return (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild>
                <a href={`/projects/${project.id}`}>
                  {project.icon ? <Icon name={project.icon as any} /> : <Folder />}
                  <span>{project.name}</span>
                </a>
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
