"use client";

import { useState } from "react";
import {
  ExternalLink,
  Github,
  History,
  Link,
  MessageSquare,
  Send,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import useProject from "~/hooks/use-project";
import CommitLog from "./commit-log";


export default function Dashboard() {
  const [question, setQuestion] = useState("");
  const project = useProject();

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
                  {project?.project?.githubUrl ?? "No repository connected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Connected Repository
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto gap-2"
              asChild
            >
              <a
                href={project?.project?.githubUrl ?? "#"}
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

      <div className="container grid gap-6 px-4 py-6 md:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          {/* AI Chat Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5" />
                Ask a question
              </CardTitle>
              <CardDescription>
                Dionysus has knowledge of the codebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Which file should I edit to change the home page?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button className="gap-2">
                  Ask Dionysus!
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <CommitLog />
        </div>

        {/* Sidebar - You can add additional widgets here */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Repository Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open PRs</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closed PRs</span>
                  <span className="font-medium">3,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="font-medium">156</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
