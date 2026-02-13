import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export const aiService = {
  getEmbeddings() {
    return new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      modelName: "models/gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
  }
};