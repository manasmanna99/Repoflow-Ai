"use client";

import {
  ExternalLink,
  Github,
  History,
  Link,
  MessageSquare,
  Send,
  GitPullRequest,
  GitMerge,
  Users,
  RefreshCw,
  Loader2,
  Archive,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import useProject from "~/hooks/use-project";
import CommitLog from "./commit-log";
import { AskQuestionCard } from "./ask-question-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArchiveButton } from "./archive-button";
import { useRouter, useSearchParams } from "next/navigation";
import TeamMembers from "./team-member";

// Type for GitHub repository stats
type RepoStats = {
  openPRs: number;
  closedPRs: number;
  contributors: number;
  stars: number;
  forks: number;
  lastUpdated: string;
  isLoading: boolean;
};

export default function Dashboard() {
  const { project, projectId, setProjectId, projects } = useProject();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repoStats, setRepoStats] = useState<RepoStats>({
    openPRs: 0,
    closedPRs: 0,
    contributors: 0,
    stars: 0,
    forks: 0,
    lastUpdated: "",
    isLoading: true,
  });
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

  // Function to extract owner and repo from GitHub URL
  const extractRepoInfo = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== "github.com") return null;

      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) return null;

      return {
        owner: pathParts[0],
        repo: pathParts[1],
      };
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  // Function to fetch repository stats from GitHub API
  const fetchRepoStats = async () => {
    if (!project?.githubUrl) return;

    setRepoStats((prev) => ({ ...prev, isLoading: true }));

    const repoInfo = extractRepoInfo(project.githubUrl);
    if (!repoInfo) {
      toast.error("Invalid GitHub repository URL");
      setRepoStats((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Fetch basic repo info
      const repoResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
      );
      if (!repoResponse.ok) throw new Error("Failed to fetch repository data");
      const repoData = await repoResponse.json();

      // Fetch open PRs
      const openPRsResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/pulls?state=open&per_page=1`,
      );
      const openPRsCount = parseInt(
        openPRsResponse.headers.get("X-Total-Count") || "0",
      );

      // Fetch closed PRs
      const closedPRsResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/pulls?state=closed&per_page=1`,
      );
      const closedPRsCount = parseInt(
        closedPRsResponse.headers.get("X-Total-Count") || "0",
      );

      // Fetch contributors
      const contributorsResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contributors?per_page=1`,
      );
      const contributorsCount = parseInt(
        contributorsResponse.headers.get("X-Total-Count") || "0",
      );

      setRepoStats({
        openPRs: openPRsCount,
        closedPRs: closedPRsCount,
        contributors: contributorsCount,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        lastUpdated: new Date().toLocaleTimeString(),
        isLoading: false,
      });

      toast.success("Repository stats updated");
    } catch (error) {
      console.error("Error fetching repo stats:", error);
      toast.error("Failed to fetch repository stats");
      setRepoStats((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Function to handle manual refresh
  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    fetchRepoStats().finally(() => {
      setIsRefreshing(false);
    });
  };

  // Fetch stats on initial load and when project changes
  useEffect(() => {
    if (project?.githubUrl) {
      fetchRepoStats();

      // Set up interval for periodic refresh (every 5 minutes)
      const interval = setInterval(fetchRepoStats, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [project?.githubUrl]);

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

        {/* Sidebar - Repository Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Repository Stats</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={repoStats.isLoading || isRefreshing}
                className="h-8 w-8"
                title="Refresh stats"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </CardHeader>
            <CardContent>
              {repoStats.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Open PRs</span>
                      </div>
                      <span className="font-medium">{repoStats.openPRs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitMerge className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          Closed PRs
                        </span>
                      </div>
                      <span className="font-medium">{repoStats.closedPRs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          Contributors
                        </span>
                      </div>
                      <span className="font-medium">
                        {repoStats.contributors}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-primary"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                        <span className="text-muted-foreground">Stars</span>
                      </div>
                      <span className="font-medium">{repoStats.stars}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-primary"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                        </svg>
                        <span className="text-muted-foreground">Forks</span>
                      </div>
                      <span className="font-medium">{repoStats.forks}</span>
                    </div>
                  </div>
                  {repoStats.lastUpdated && (
                    <p className="mt-4 text-right text-xs text-muted-foreground">
                      Last updated: {repoStats.lastUpdated}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Team Members Section */}
        </div>
      </div>
    </div>
  );
}
