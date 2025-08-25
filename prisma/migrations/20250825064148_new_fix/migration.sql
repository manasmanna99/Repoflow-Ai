-- CreateIndex
CREATE INDEX "SourceCodeEmbedding_projectId_idx" ON "SourceCodeEmbedding"("projectId");

-- CreateIndex
CREATE INDEX "SourceCodeEmbedding_projectId_fileName_idx" ON "SourceCodeEmbedding"("projectId", "fileName");
