"use client";

import { useEffect, useState } from "react";
import { RepoAnalysisWrapper } from "~/components/repo-analysis-wrapper";
import {
  analyzeWithGemini,
  type RepositoryAnalysis,
} from "~/lib/services/repository-analysis";

interface PageProps {
  params: {
    owner: string;
    repo: string;
  };
}

export default function RepositoryPage({ params }: PageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const { owner, repo } = params;

  const analyzeRepository = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeWithGemini(owner, repo);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing repository:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeRepository();
  }, [owner, repo]);

  return (
    <RepoAnalysisWrapper isAnalyzing={isAnalyzing}>
      <div className="container mx-auto max-w-7xl space-y-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {owner}/{repo}
          </h1>
          <button
            onClick={analyzeRepository}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Refresh Analysis
          </button>
        </div>

        {analysis && (
          <div className="grid gap-6">
            {/* Source Code Summary */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Source Code Analysis</h2>
              <p className="mt-2 text-muted-foreground">
                {analysis.sourceCodeSummary}
              </p>
            </div>

            {/* Commit History */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Commit History</h2>
              <p className="mt-2 text-muted-foreground">
                {analysis.commitHistory.summary}
              </p>
              <div className="mt-4">
                <h3 className="font-medium">Key Trends</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  {analysis.commitHistory.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Embeddings */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold">Code Embeddings</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Generated embeddings for {analysis.codeEmbeddings.files.length}{" "}
                files
              </p>
              <div className="mt-4 max-h-40 overflow-y-auto">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {analysis.codeEmbeddings.files.map((file, index) => (
                    <li key={index} className="font-mono">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </RepoAnalysisWrapper>
  );
}
