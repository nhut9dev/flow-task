'use client';

import { ChevronsUpDown, Folder as FolderIcon, Plus } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~ui/dropdown-menu';
import Icon from '~ui/icon';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~ui/sidebar';

import { CreateFolderForm } from './create-folder-form';

export default function Header({
  folders,
  selectedFolderId,
  setSelectedFolderId,
}: {
  folders: {
    id: string;
    name: string;
    icon?: string;
    projectIds: string[];
    createdAt: string;
    modifiedAt: string;
  }[];
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
}) {
  const { isMobile } = useSidebar();
  // Find the active folder or null (for all)
  const activeFolder = selectedFolderId ? folders.find((f) => f.id === selectedFolderId) : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeFolder ? (
                  activeFolder.icon ? (
                    <Icon name={activeFolder.icon as any} className="size-4" />
                  ) : (
                    <FolderIcon className="size-4" />
                  )
                ) : (
                  <FolderIcon className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeFolder ? activeFolder.name : 'All folders'}
                </span>
                <span className="truncate text-xs">
                  {activeFolder ? `Projects: ${activeFolder.projectIds.length}` : 'All projects'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Folders</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setSelectedFolderId(null)}
              className={`gap-2 p-2${selectedFolderId === null ? ' bg-accent text-accent-foreground' : ''}`}
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <FolderIcon className="size-3.5 shrink-0" />
              </div>
              All folders
            </DropdownMenuItem>
            {folders.map((folder, index) => (
              <DropdownMenuItem
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`gap-2 p-2${selectedFolderId === folder.id ? ' bg-accent text-accent-foreground' : ''}`}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {folder.icon ? (
                    <Icon name={folder.icon as any} className="size-3.5 shrink-0" />
                  ) : (
                    <FolderIcon className="size-3.5 shrink-0" />
                  )}
                </div>
                {folder.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <CreateFolderForm>
              <DropdownMenuItem className="gap-2 p-2" onSelect={(e) => e.preventDefault()}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Add folder</div>
              </DropdownMenuItem>
            </CreateFolderForm>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
