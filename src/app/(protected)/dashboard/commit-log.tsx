"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { History } from "lucide-react";
import useProject from "~/hooks/use-project";
import { api } from "~/trpc/react";

export default function CommitLog() {
  const { projectId } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: projectId!,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <History className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 h-full w-0.5 -translate-x-1/2 bg-border/60" />

          {commits?.map((commit, index) => (
            <div key={commit.id}>
              <div className="relative flex gap-4">
                {/* Circle connector */}
                <div className="absolute left-5 top-5 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />

                <Avatar className="relative h-10 w-10 border-4 border-background">
                  <AvatarImage
                    src={commit.commitAuthorAvatar}
                    alt={commit.commitAuthorName}
                  />
                  <AvatarFallback>{commit.commitAuthorName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium leading-none">
                        {commit.commitAuthorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {commit.commitDate.toLocaleDateString()}
                      </p>
                    </div>
                    {commit.summary && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        committed
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-sm font-medium leading-none">
                    {commit.commitMessage}
                  </h4>
                  <div className="mt-2 space-y-2">
                    {commit.summary
                      ?.split("\n")
                      .filter((desc) => !desc.includes("```"))
                      .map((desc, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          • {desc}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
              {index < commits.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
