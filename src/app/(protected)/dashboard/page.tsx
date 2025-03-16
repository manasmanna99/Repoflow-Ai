"use client";

import React, { Suspense, useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Archive,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import useProject from "~/hooks/use-project";
import CommitLog from "./commit-log";
import { AskQuestionCard } from "./ask-question-card";
import { ArchiveButton } from "./archive-button";
import { useRouter, useSearchParams } from "next/navigation";

const DashboardContent = () => {
  const { project, projectId, setProjectId, projects } = useProject();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle setProject query parameter
  useEffect(() => {
    const setProjectParam = searchParams.get("setProject");
    if (setProjectParam && setProjectParam !== projectId) {
      console.log(`Setting project ID from URL parameter: ${setProjectParam}`);
      setProjectId(setProjectParam);

      // Remove the query parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, projectId, setProjectId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Repository Banner */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex w-full items-center gap-4 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Github className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-1 items-center overflow-hidden">
              <div className="flex flex-col overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {project?.githubUrl ?? "No repository connected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Connected Repository
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => router.push("/archived")}
              >
                <Archive className="h-4 w-4" />
                <span className="hidden sm:inline">Archived</span>
              </Button>
              <ArchiveButton />
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a
                  href={project?.githubUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-6 px-4 py-6 md:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          {/* AI Chat Section */}
          <AskQuestionCard />

          {/* Activity Feed */}
          <CommitLog />
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}