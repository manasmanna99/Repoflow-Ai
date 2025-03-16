"use client";

import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { UserButtonWrapper } from "~/components/user-button-wrapper";

type props = {
  children: React.ReactNode;
};

function SidebarLayout({ children }: props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card/50 p-2 px-4 shadow dark:border-border/20 dark:bg-card">
          {/* <Searchbar/> */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserButtonWrapper />
          </div>
        </div>
        <div className="h-4"></div>
        {/* main content */}
        <div className="h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-border bg-card p-4 shadow dark:border-border/20 dark:bg-card">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
export default SidebarLayout;
