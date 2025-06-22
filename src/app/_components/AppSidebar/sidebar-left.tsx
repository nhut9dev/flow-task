'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '~ui/sidebar';
import { H1 } from '~ui/typography';

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Common');

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <H1 className="bg-gradient-to-r from-cyan-500 to-rose-500 bg-clip-text text-transparent">
          {t('appName')}
        </H1>
      </SidebarHeader>
      <SidebarContent>Content</SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
