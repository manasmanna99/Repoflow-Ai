import React, { useEffect } from "react";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export default function useProject() {
  const [projectId, setProjectId] = useLocalStorage<string>(
    "repoflow-projectId",
    "",
  );
  const { data: projects, isLoading } = api.project.getProjects.useQuery();
  const project = projects?.find((project) => project.id === projectId);

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
  };
}
