import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";


export async function generateTitle(userQuery: string): Promise<string> {
 
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash", 
    maxOutputTokens: 20,
    apiKey: process.env.GOOGLE_API_KEY, 
  });

  const prompt = PromptTemplate.fromTemplate(`
    Eres un asistente que crea títulos para conversaciones.
    Lee el siguiente mensaje y crea un título de máximo 4 palabras.
    
    MENSAJE: "{query}"
    
    RESPONDE SOLO EL TÍTULO:
  `);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({ query: userQuery });

  return response.content.toString().trim();
}