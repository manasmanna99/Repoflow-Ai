import { UserButton } from "@clerk/nextjs";
import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";

type props = {
  children: React.ReactNode;
}
function SidebarLayout({children}: props) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-purple-400 bg-sidebar p-2 px-4 shadow">
          {/* Sidebar */}
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <div className="h-4"></div>
        <div className="no-scrollbar border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll no-scrollbar h-[calc(100vh-6rem)] p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default SidebarLayout;
