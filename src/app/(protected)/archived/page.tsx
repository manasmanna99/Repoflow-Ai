"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  RefreshCcw,
  ExternalLink,
  Search,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";
import { formatDistanceToNow } from "date-fns";

export default function ArchivedProjectsPage() {
  const router = useRouter();
  const refetch = useRefetch();
  const [searchQuery, setSearchQuery] = useState("");

  // Get archived projects from the API
  const { data: archivedProjects, isLoading: isLoadingProjects } =
    api.project.getArchivedProjects.useQuery(undefined, {
      refetchOnWindowFocus: true,
    });

  // Restore project mutation
  const restoreProject = api.project.restoreProject.useMutation({
    onSuccess: () => {
      toast.success("Project restored successfully");
      refetch(["project.getProjects", "project.getArchivedProjects"]);
    },
    onError: (error) => {
      toast.error(`Failed to restore project: ${error.message}`);
    },
  });

  // Delete project mutation
  const deleteProject = api.project.deleteProject.useMutation({
    onSuccess: () => {
      toast.success("Project permanently deleted");
      refetch(["project.getArchivedProjects"]);
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });

  // Handle restore project
  const handleRestore = (projectId: string) => {
    restoreProject.mutate({ projectId });
  };

  // Handle delete project
  const handleDelete = (projectId: string, projectName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${projectName}"? This action cannot be undone.`,
    );
    if (confirmed) {
      deleteProject.mutate({ projectId });
    }
  };

  // Filter projects based on search query
  const filteredProjects =
    archivedProjects?.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.githubUrl.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Archived Projects</h1>
          <Badge variant="outline" className="ml-2">
            <Archive className="mr-1 h-3 w-3" />
            {archivedProjects?.length || 0}
          </Badge>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoadingProjects ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 truncate">
                  <Archive className="h-4 w-4 text-muted-foreground" />
                  {project.name}
                </CardTitle>
                <CardDescription className="truncate">
                  {project.githubUrl}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Archived {formatDistanceToNow(new Date(project.deletedAt!))}{" "}
                    ago
                  </p>
                  <p>
                    Created {formatDistanceToNow(new Date(project.createdAt))}{" "}
                    ago
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleRestore(project.id)}
                  disabled={restoreProject.isPending}
                >
                  {restoreProject.isPending &&
                  restoreProject.variables?.projectId === project.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-3 w-3" />
                  )}
                  Restore
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  asChild
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    GitHub
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleDelete(project.id, project.name)}
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending &&
                  deleteProject.variables?.projectId === project.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Archive className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium">No archived projects</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            When you archive projects, they will appear here.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
