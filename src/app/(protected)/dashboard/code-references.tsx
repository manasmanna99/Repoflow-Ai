"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
};

export const CodeReferences = ({ filesReferences }: Props) => {
  const [activeTab, setActiveTab] = useState(filesReferences[0]?.fileName);

  if (filesReferences.length === 0) return null;

  return (
    <div className="max-w-[80vw]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full flex-wrap gap-2 bg-transparent">
          {filesReferences.map((file) => (
            <TabsTrigger
              key={file.fileName}
              value={file.fileName}
              className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              {file.fileName}
            </TabsTrigger>
          ))}
        </TabsList>
        {filesReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="mt-4 max-h-[40vh] overflow-auto rounded-md border bg-background p-4"
          >
            <SyntaxHighlighter language="typescript" style={lucario}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
