"use client";

import HomeNavbar from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type HomeLayoutProps = {
  children: React.ReactNode;
};

export const HomeLayout = ({ children }: HomeLayoutProps) => {
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
