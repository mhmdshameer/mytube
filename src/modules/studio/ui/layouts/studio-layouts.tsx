"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeSidebar } from "@/modules/home/ui/components/home-sidebar";
import { StudioNavbar } from "@/modules/studio/ui/components/studio-navbar";

type StudioLayoutProps = {
  children: React.ReactNode;
};

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen" suppressHydrationWarning>
        <StudioNavbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-[4rem]">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
