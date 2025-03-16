"use client";

import { RepoAnalysisLoading } from "./ui/repo-analysis-loading";

interface RepoAnalysisWrapperProps {
  isAnalyzing: boolean;
  children: React.ReactNode;
}

export const RepoAnalysisWrapper = ({
  isAnalyzing,
  children,
}: RepoAnalysisWrapperProps) => {
  if (isAnalyzing) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <RepoAnalysisLoading />
      </div>
    );
  }

  return <>{children}</>;
};
