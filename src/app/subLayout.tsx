'use client';

import Footer from '~components/Footer';
import Header from '~components/Header';

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-background">
      <Header />
      <main className="p-2	min-h-[calc(100%-4rem)]">{children}</main>
      <Footer />
    </div>
  );
}
