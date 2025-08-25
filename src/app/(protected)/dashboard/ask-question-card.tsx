"use client";

import { Send, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useCallback, useState } from "react";
import useProject from "~/hooks/use-project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { askQuestion } from "~/actions/aiAnswer";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CodeReferences } from "./code-references";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";

export const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const savedAnswers = api.project.saveAnswer.useMutation();
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState<string>("");

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setAnswer(""); // Reset previous answer
    try {
      const { output, filesReferences } = await askQuestion(
        question,
        project.id,
      );
      setOpen(true);
      setFilesReferences(filesReferences);

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAnswer((prev) => prev + delta);
        }
      }
    } catch (error) {
      console.error("Error getting answer:", error);
      setAnswer("An error occurred while generating the response.");
    } finally {
      setLoading(false);
    }
  }, [project?.id, question]);

  const handleSave = () => {
    savedAnswers.mutate(
      {
        projectId: project!.id,
        question,
        answer,
        filesReferences,
      },
      {
        onSuccess: () => {
          toast.success("Answer saved");
          refetch();
        },
        onError: () => {
          toast.error("Error saving answer");
        },
      },
    );
  };
  const refetch=useRefetch();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src="/logo.svg" alt="RepoFlow" width={40} height={40} />
              <span>RepoFlow AI Assistant</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full pr-4">
            <div className="prose dark:prose-invert max-w-none">
              <MDEditor.Markdown
                source={answer}
                className="custom-markdown"
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  width: "100%",
                }}
              />
              {filesReferences.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 font-medium">Referenced Files:</h4>
                  <CodeReferences filesReferences={filesReferences} />
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Answer
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5" />
            Ask a question
          </CardTitle>
          <CardDescription>
            RepoFlow has knowledge of the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button
              className="gap-2"
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Ask RepoFlow!"}
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
