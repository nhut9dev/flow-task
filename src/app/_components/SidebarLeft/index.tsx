'use client';

import * as React from 'react';

import { NavMain } from '~app/_components/SidebarLeft/nav-main';
import { NavProjects } from '~app/_components/SidebarLeft/nav-project';
import { useInitStore } from '~hooks/useInitStore';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '~ui/sidebar';

import Header from './header';

export default function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedFolderId] = React.useState<string | null>(null); // null = all projects
  const [isClient, setIsClient] = React.useState(false);

  // Initialize stores with API data
  useInitStore({
    fetchProjects: true,
  });

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Header />
        </SidebarHeader>
        <SidebarContent>{/* Loading state during SSR */}</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
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
