"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Github, Key, LinkIcon, Loader2, Coins } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";
import { Progress } from "~/components/ui/progress";
import { useRouter } from "next/navigation";
import useProject from "~/hooks/use-project";
import { CreditPurchaseModal } from "~/components/CreditPurchaseModal";
type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

type ProcessStep = {
  title: string;
  description: string;
  progress: number;
};

const processSteps: ProcessStep[] = [
  {
    title: "Validating Repository",
    description: "Checking repository access and structure...",
    progress: 25,
  },
  {
    title: "Setting Up Project",
    description: "Creating project configuration...",
    progress: 50,
  },
  {
    title: "Analyzing Codebase",
    description: "Scanning repository contents...",
    progress: 75,
  },
  {
    title: "Finalizing Setup",
    description: "Completing project initialization...",
    progress: 100,
  },
];

export default function CreatePage() {
  const [showToken, setShowToken] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState<number | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const { data: userCredits } = api.user.getCredits.useQuery();
  const refetch = useRefetch();
  const router = useRouter();
  const { setProjectId } = useProject();

  // Watch for repo URL changes
  const repoUrl = watch("repoUrl");

  // Calculate required credits when repo URL changes
  useEffect(() => {
    if (repoUrl) {
      const calculateCredits = async () => {
        try {
          const response = await fetch("/api/calculate-credits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ repoUrl }),
          });
          const data = await response.json();
          setRequiredCredits(data.requiredCredits);
        } catch (error) {
          console.error("Error calculating credits:", error);
        }
      };
      void calculateCredits();
    }
  }, [repoUrl]);

  // Get current step data safely
  const currentStepData =
    currentStep >= 0 && currentStep < processSteps.length
      ? processSteps[currentStep]
      : null;

  async function onSubmit(data: FormInput) {
    try {
      if (!userCredits || userCredits.credits < (requiredCredits ?? 1)) {
        setShowCreditModal(true);
        return;
      }

      // Start processing animation
      for (let i = 0; i < processSteps.length; i++) {
        setCurrentStep(i);
        // Simulate processing time for each step
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const result = await createProject.mutateAsync({
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      });

      toast.success("Project created successfully");
      setProjectId(result.id);
      await refetch();
      reset();
      router.push("/dashboard");
    } catch (error: any) {
      setCurrentStep(-1);
      if (error.message.includes("Insufficient credits")) {
        setShowCreditModal(true);
      } else {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="grid max-h-[90vh] w-full max-w-4xl border-border/40 shadow-xl md:grid-cols-2">
        <div className="relative flex flex-col items-center justify-center bg-primary/5 p-6 md:p-10">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary)/0.1)_0%,transparent_60%)]"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            {currentStep === -1 ? (
              <>
                <div className="relative mb-8 h-48 w-48 md:h-64 md:w-64">
                  <Image
                    src="/logo.svg"
                    alt="Developer illustration"
                    width={256}
                    height={256}
                    className="object-contain"
                  />
                  <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
                  <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-xl"></div>
                </div>
                <h2 className="mb-2 text-xl font-bold md:text-2xl">
                  Connect Your Code
                </h2>
                <p className="max-w-xs text-muted-foreground">
                  Link your GitHub repository to unlock powerful development
                  tools and seamless deployment.
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {userCredits?.credits ?? 0} credits available
                    </span>
                  </div>
                  {requiredCredits && (
                    <div className="text-sm text-muted-foreground">
                      This project requires {requiredCredits} credits
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-32 w-32 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
                  </div>
                </div>
                {currentStepData && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-semibold">
                      {currentStepData.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentStepData.description}
                    </p>
                    <Progress
                      value={currentStepData.progress}
                      className="w-64"
                    />
                    <p className="text-sm text-primary">
                      {currentStepData.progress}% Complete
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-sm ${i % 3 === 0 ? "bg-primary/80" : i % 2 === 0 ? "bg-primary/60" : "bg-primary/30"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto p-6 md:p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <div className="flex-1">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold md:text-3xl">
                  Link your GitHub Repository
                </CardTitle>
                <CardDescription className="text-base">
                  Enter the URL of your GitHub repository to link it to
                  RepoFlow.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-0 py-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="project-name"
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome Project"
                    className="bg-background/50"
                    {...register("projectName", { required: true })}
                    required
                    disabled={createProject.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo-url" className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    GitHub Repository URL
                  </Label>
                  <Input
                    id="repo-url"
                    placeholder="https://github.com/username/repository"
                    className="bg-background/50"
                    {...register("repoUrl", { required: true })}
                    type="url"
                    required
                    disabled={createProject.isPending}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="show-token"
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span>I need to use a private repository</span>
                    </Label>
                    <Switch
                      id="show-token"
                      checked={showToken}
                      onCheckedChange={setShowToken}
                      disabled={createProject.isPending}
                    />
                  </div>

                  {showToken && (
                    <div className="space-y-2 pt-2 duration-300 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="github-token">GitHub Token</Label>
                      <Input
                        id="github-token"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        type="password"
                        className="bg-background/50"
                        {...register("githubToken", { required: showToken })}
                        required={showToken}
                        disabled={createProject.isPending}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Tokens with 'repo' scope are required for private
                        repositories.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            <CardFooter className="flex flex-col items-stretch gap-4 border-t border-border/30 px-0 pt-4">
              <Button
                type="submit"
                className="group w-full gap-2"
                disabled={createProject.isPending}
              >
                {createProject.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create Project{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                By connecting your repository, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </div>
            </CardFooter>
          </form>
        </div>
      </Card>

      <CreditPurchaseModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        requiredCredits={requiredCredits || undefined}
      />
    </div>
  );
}
