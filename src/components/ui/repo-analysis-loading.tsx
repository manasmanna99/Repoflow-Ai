"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

const steps = [
  "Analyzing repository structure...",
  "Processing source code with Gemini...",
  "Generating code embeddings...",
  "Summarizing commit history...",
  "Creating intelligent insights...",
];

export const RepoAnalysisLoading = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card p-8 text-card-foreground">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="size-12 text-primary" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold">Analyzing Repository</h3>
          <p className="text-sm text-muted-foreground">
            This may take a few minutes
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2 text-sm",
              currentStep === index && "bg-muted",
            )}
          >
            <div
              className={cn(
                "size-2 rounded-full",
                index < currentStep
                  ? "bg-primary"
                  : index === currentStep
                    ? "animate-pulse bg-primary/60"
                    : "bg-muted-foreground/20",
              )}
            />
            <span
              className={cn(
                index < currentStep
                  ? "text-primary"
                  : index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="h-1.5 w-64 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{
              width: ["0%", "100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Processing repository data...
        </p>
      </div>
    </div>
  );
};
