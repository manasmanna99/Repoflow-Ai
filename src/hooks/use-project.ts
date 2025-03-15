import React from "react";
import { api } from "~/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export default function useProject() {
  const [projectId, setProjectId] = useLocalStorage("repoflow-projectId", "");
  const { data: projects } = api.project.getProjects.useQuery();
  const project = projects?.find((project) => project.id === projectId);
  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
}
