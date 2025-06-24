'use client';

import * as React from 'react';

import { NavMain } from '~app/_components/SidebarLeft/nav-main';
import { NavProjects } from '~app/_components/SidebarLeft/nav-project';
import { useFolderStore } from '~stores/folderStore';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '~ui/sidebar';

import Header from './header';

export default function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const folders = useFolderStore((state) => state.folders);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null); // null = all folders

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Header
          folders={folders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects selectedFolderId={selectedFolderId} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        Footer
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
