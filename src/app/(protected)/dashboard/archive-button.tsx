"use client";

import useProject from "~/hooks/use-project";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";
import { useRouter } from "next/navigation";

export function ArchiveButton() {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();
  const router = useRouter();

  return (
    <Button
      disabled={archiveProject.isPending}
      size="sm"
      variant="destructive"
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to archive this project?",
        );
        if (confirm) {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project archived successfully");
                // Refresh both project lists
                refetch(["project.getProjects", "project.getArchivedProjects"]);
                // Navigate to dashboard after archiving
                router.push("/dashboard");
              },
              onError: (error) => {
                toast.error(error.message);
              },
            },
          );
        }
      }}
    >
      Archive
    </Button>
  );
}
