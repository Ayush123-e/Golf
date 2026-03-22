"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname();
  const isPublicPage = ["/", "/login", "/signup"].includes(pathname);
  const showSidebar = user && !isPublicPage;

  return (
    <>
      {user && <Navigation />}
      <main className={`${showSidebar ? "md:ml-64" : ""} flex-1 min-h-screen relative z-10`}>
        {children}
      </main>
    </>
  );
}
