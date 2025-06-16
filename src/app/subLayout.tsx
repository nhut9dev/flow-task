'use client';

import BreadcrumbCurrent from '~components/BreadcrumbCurrent';
import { SidebarTrigger } from '~ui/sidebar';

// provider - session - header - footer
export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <header className="flex items-center">
        <SidebarTrigger />
        <BreadcrumbCurrent />
      </header>
      <main>{children}</main>
      <footer>footer</footer>
    </div>
  );
}
