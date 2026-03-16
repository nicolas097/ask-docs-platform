// frontend/src/lib/services/ai-service.ts

import {aiService } from "./ai-service";

export async function getQueryEmbedding(query: string): Promise<number[]> {
  const model = aiService.getEmbeddings(); // Usando el modelo de Gemini
  const embedding = await model.embedQuery(query);
  return embedding;
}