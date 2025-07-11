'use client';

import { Folder as FolderIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~ui/sidebar';

export default function Header() {
  const t = useTranslations('Sidebar');

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <FolderIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{t('flowTask')}</span>
            <span className="truncate text-xs">{t('taskManagement')}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
