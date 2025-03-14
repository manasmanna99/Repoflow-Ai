"use client";

import {
  IconCreditCard,
  IconDashboard,
  IconMessageCircle,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import Image from "next/image";

const links = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <IconDashboard />,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: <IconMessageCircle />,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: <IconCreditCard />,
  },
];

const projects = [
  {
    name: "Project 1",
  },
  {
    name: "Project 2",
  },
  {
    name: "Project 3",
  },
  {
    name: "Project 4",
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          {open && (
            <h1 className="text-xl font-bold text-primary/80">RepoFlow Ai</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          {
                            "!bg-primary !text-white": pathname === item.url,
                          },
                          "list-none",
                        )}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-sm border bg-white text-sm text-primary",
                            {
                              "bg-primary text-white": true,
                              "size-6": open,
                              "size-8": !open,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>
                        {open && <span>{project.name}</span>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <div className="h-2"></div>
              <SidebarMenuItem>
                <Link href="/create">
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "w-full",
                      !open && "flex h-8 w-8 items-center justify-center p-0",
                    )}
                  >
                    <IconPlus className="h-4 w-4" />
                    {open && <span className="ml-2">Create Project</span>}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
