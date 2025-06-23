'use client';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '~app/_components/SidebarLeft/nav-main';
import { NavProjects } from '~app/_components/SidebarLeft/nav-project';
import { NavUser } from '~app/_components/SidebarLeft/nav-user';
import { useFolderStore } from '~stores/folderStore';
import { useProjectStore } from '~stores/projectStore';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '~ui/sidebar';

import Header from './header';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export default function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const folders = useFolderStore((state) => state.folders);
  const projects = useProjectStore((state) => state.projects);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null); // null = all folders

  // Filter projects by selected folder
  const filteredProjects = React.useMemo(() => {
    if (!selectedFolderId) return projects;
    return projects.filter((project) => project.folderId === selectedFolderId);
  }, [projects, selectedFolderId]);

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
        <NavMain items={data.navMain} />
        <NavProjects projects={filteredProjects} selectedFolderId={selectedFolderId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
