import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { aiService } from "./ai-service";


export async function generateTitle(firstMessage: string): Promise<string> {

  const model = aiService.getGenerativeChat();

  const prompt = PromptTemplate.fromTemplate(`
    Eres un Gestor Documental experto en análisis de archivos PDF. 
    Tu objetivo es crear un título técnico y profesional para una sesión de consulta basada en el contenido de un documento.

    REGLAS DE ORO:
    - Usa términos de análisis (ej: "Revisión de...", "Análisis técnico de...", "Extracción de...").
    - Si el mensaje es una pregunta sobre el PDF, el título debe resumir el TEMA de la pregunta.
    - Sin artículos iniciales ni puntos finales.

    MENSAJE DEL USUARIO: "{query}"

    RESPONDE SOLO EL TÍTULO TÉCNICO:
  `);

  const chain = prompt.pipe(model);

  try {
    const response = await chain.invoke({ query: firstMessage });

    return response.content.toString().trim();
  
  } catch (error) {
    console.error("Error en AI Title Generation:", error);
    return "Análisis de Documento PDF"; 
  }
}

