'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { useProjectStore } from '~stores/projectStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~ui/breadcrumb';
import { breadcrumbMap } from '~utils/breadcrumb';

const BreadcrumbCurrent = () => {
  const pathname = usePathname();
  const projects = useProjectStore((state) => state.projects);
  const t = useTranslations('Project');

  const pathList = [
    '/',
    ...pathname
      .split('/')
      .filter(Boolean)
      .map((_, idx, arr) => '/' + arr.slice(0, idx + 1).join('/')),
  ];

  const getBreadcrumbLabel = (path: string) => {
    // Check if it's a known route first
    if (breadcrumbMap[path]) {
      return breadcrumbMap[path];
    }

    // Check if it's a project route (e.g., /projects/123)
    if (path.startsWith('/projects/')) {
      const projectId = path.split('/').pop();
      if (projectId) {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          // Handle i18n for default projects
          if (project.name.startsWith('Project.')) {
            return t(project.name.replace('Project.', ''));
          }
          return project.name;
        }
      }
    }

    // Fallback to decoded path segment
    return decodeURIComponent(path.split('/').pop() || '');
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathList.map((path, idx) => {
          const isLast = idx === pathList.length - 1;
          const label = getBreadcrumbLabel(path);

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCurrent;
