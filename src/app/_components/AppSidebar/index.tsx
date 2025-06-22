import { ReactNode } from 'react';

import { SidebarInset } from '~ui/sidebar';

import { SidebarLeft } from './sidebar-left';
import { SidebarRight } from './sidebar-right';

export default function AppSidebar({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarLeft />
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </>
  );
}
