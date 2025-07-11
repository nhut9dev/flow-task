'use client';

import Footer from '~components/Footer';
import Header from '~components/Header';
import { useInitStore } from '~hooks/useInitStore';

import AppSidebar from './_components/AppSidebar';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  useInitStore();

  return (
    <AppSidebar>
      <div className="w-full bg-background">
        <Header />
        <main className="p-2	min-h-[calc(100%-4rem)]">{children}</main>
        <Footer />
      </div>
    </AppSidebar>
  );
}
