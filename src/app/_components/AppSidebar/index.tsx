import { ReactNode } from 'react';

import { SidebarInset } from '~ui/sidebar';

import SidebarLeft from '../SidebarLeft';
import SidebarRight from '../SidebarRight';

export default function AppSidebar({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarLeft />
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </>
  );
}
