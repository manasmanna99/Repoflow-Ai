"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet";
import useProject from "~/hooks/use-project";
import { api } from "~/trpc/react";
import { AskQuestionCard } from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import { CodeReferences } from "../dashboard/code-references";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MessageSquare, Code2, Calendar, FileText } from "lucide-react";
import { Separator } from "~/components/ui/separator";

function QaPage() {
  const { projectId } = useProject();
  const { data: questionsResponse } = api.project.getQuestions.useQuery({
    projectId,
  });
  const questions = questionsResponse?.questions || [];
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];

  const getCleanDescription = (markdown: string) => {
    // Remove code blocks
    const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
    // Remove markdown links
    const withoutLinks = withoutCode.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    // Remove special characters and numbers
    const cleanText = withoutLinks.replace(/[^a-zA-Z\s.,!?]/g, " ");
    // Remove extra spaces and trim
    const finalText = cleanText.replace(/\s+/g, " ").trim();
    // Get first 200 characters
    return finalText.slice(0, 200) + (finalText.length > 200 ? "..." : "");
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <AskQuestionCard />
      <div className="h-8" />
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold text-foreground">
          Saved Questions
        </h1>
      </div>
      <div className="h-4" />
      <div className="grid gap-4">
        {questions?.map((question, index) => (
          <Sheet key={question.id}>
            <SheetTrigger
              className="w-full"
              onClick={() => setQuestionIndex(index)}
            >
              <div className="flex w-full cursor-pointer items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <img
                  className="h-10 w-10 rounded-full"
                  src={question.user.imageUrl ?? ""}
                  alt="User avatar"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-medium text-foreground">
                      {question.question}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{question.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {getCleanDescription(question.answer)}
                  </p>
                  {Array.isArray(question.filesReferences) &&
                    question.filesReferences.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                        <Code2 className="h-4 w-4" />
                        <span>
                          {question.filesReferences.length} code references
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="w-full border-l border-border sm:max-w-[1200px] 2xl:max-w-[1400px]">
              <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                <SheetHeader className="space-y-4">
                  <SheetTitle className="text-2xl font-semibold text-foreground">
                    {question.question}
                  </SheetTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <img
                      className="h-6 w-6 rounded-full"
                      src={question.user.imageUrl ?? ""}
                      alt="User avatar"
                    />
                    <span>
                      Asked on {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                      Answer
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <MDEditor.Markdown source={question.answer} />
                    </div>
                  </div>

                  {Array.isArray(question.filesReferences) &&
                    question.filesReferences.length > 0 && (
                      <div className="rounded-lg border border-border bg-card">
                        <div className="border-b border-border bg-muted/40 p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">
                              Summary
                            </h3>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {getCleanDescription(question.answer)}
                          </p>
                        </div>
                        <div className="border-b border-border bg-muted/40 p-4">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">
                              Code References
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <CodeReferences
                            filesReferences={
                              question.filesReferences as Array<{
                                fileName: string;
                                sourceCode: string;
                                summary: string;
                              }>
                            }
                          />
                        </div>
                      </div>
                    )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}

export default QaPage;
