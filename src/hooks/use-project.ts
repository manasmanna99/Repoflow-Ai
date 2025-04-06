import React, { useEffect } from "react";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import type { Project } from "~/types/project";

export default function useProject() {
  const [projectId, setProjectId] = useLocalStorage<string>(
    "repoflow-projectId",
    "",
  );
  const {
    data: projects,
    isLoading,
    refetch,
  } = api.project.getProjects.useQuery();
  const project = projects?.find((project) => project.id === projectId) as
    | Project
    | undefined;

  // Poll for project status changes if project is being indexed
  useEffect(() => {
    if (!project || project.status !== "indexing") return;

    const pollInterval = setInterval(() => {
      void refetch();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [project, refetch]);

  // Debug logging
  useEffect(() => {
    console.log("useProject hook - projectId:", projectId);
    console.log("useProject hook - projects:", projects);
    console.log("useProject hook - selected project:", project);
  }, [projectId, projects, project]);

  // If projectId doesn't match any project, reset it
  useEffect(() => {
    if (
      !isLoading &&
      projects &&
      projects.length > 0 &&
      projectId &&
      !project
    ) {
      console.warn(
        "Project ID doesn't match any available project, resetting to first project",
      );
      if (projects[0]?.id) {
        setProjectId(projects[0].id);
      }
    }
  }, [projectId, projects, project, isLoading, setProjectId]);

  return {
    projects,
    project,
    projectId,
    setProjectId,
    isLoading,
    refetch,
  };
}



