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
import useProject from "~/hooks/use-project";

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

export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="border-r border-border/5 bg-white dark:border-border/20 dark:bg-card"
    >
      <SidebarHeader className="border-b border-border/5 dark:border-border/20 dark:bg-card">
        <div className="flex items-center gap-2 p-1">
          <div className="rounded-md bg-white/50 p-1 dark:bg-card/50">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </div>
          {open && (
            <h1 className="text-xl font-bold text-primary/80 dark:text-primary">
              RepoFlow Ai
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="dark:bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-muted-foreground">
            Application
          </SidebarGroupLabel>
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
                            "!bg-primary !text-primary-foreground":
                              pathname === item.url,
                          },
                          "list-none transition-colors dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary",
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
          <SidebarGroupLabel className="dark:text-muted-foreground">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => setProjectId(project.id)}
                        className="flex cursor-pointer items-center gap-2 transition-colors dark:text-muted-foreground dark:hover:text-primary"
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-sm border-0 bg-white/80 text-sm text-primary dark:bg-card/50",
                            {
                              "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground":
                                projectId === project.id,
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
                      "w-full border-border/5 transition-colors dark:border-border/20 dark:bg-card/50 dark:text-muted-foreground dark:hover:bg-primary/10 dark:hover:text-primary",
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
