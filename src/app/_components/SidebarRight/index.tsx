import { Plus } from 'lucide-react';
import * as React from 'react';

import { useAction } from '~hooks/useAction';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~ui/sidebar';

export default function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isTaskFocused } = useAction();

  if (!isTaskFocused) return null;

  return (
    <Sidebar className="sticky top-0 hidden border-l h-svh lg:flex" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">Header</SidebarHeader>
      <SidebarContent>
        Date picker
        <SidebarSeparator className="mx-0" />
        Calendar
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
