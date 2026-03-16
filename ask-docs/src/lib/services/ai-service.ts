import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
export const aiService = {
  getEmbeddings() {
    return new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      modelName: "models/gemini-embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
  },

  getGenerativeChat() {
    return new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
  },

};