'use client';

import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

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

  const pathList = [
    '/',
    ...pathname
      .split('/')
      .filter(Boolean)
      .map((_, idx, arr) => '/' + arr.slice(0, idx + 1).join('/')),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathList.map((path, idx) => {
          const isLast = idx === pathList.length - 1;
          const label = breadcrumbMap[path] || decodeURIComponent(path.split('/').pop() || '');

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
