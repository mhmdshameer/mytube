"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/modules/home/ui/components/home-navbar";
import { HomeSidebar } from "@/modules/home/ui/components/home-sidebar";

type StudioLayoutProps = {
  children: React.ReactNode;
};

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen" suppressHydrationWarning>
        <HomeNavbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-[4rem]">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
