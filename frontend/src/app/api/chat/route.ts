import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse} from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { google } from "@ai-sdk/google";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { aiService } from '@/lib/services/ai-service';
import { generateTitle } from "@/lib/services/ai-titler"
import { ConversationManager } from "@/lib/services/conversation-manager";
import {HistoryService} from "@/lib/services/history-service"

export const maxDuration = 15;

export async function POST(req: Request) {
  const body = await req.json();
 const { chatId, messages } = body;

  // 1. EL NORMALIZADOR: Estandarizamos los mensajes para LangChain
 
  try {
    // LLAMADA CLAVE: Delegamos toda la complejidad al Manager



  // Combinamos historial validado con el mensaje nuevo

    const stream = await ConversationManager.processMessage(chatId, messages);

    // Retornamos la respuesta de stream configurada
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });

  } catch (error: any) {
    // Manejo técnico de errores de red o timeouts en Santiago
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return new Response("El modelo tardó demasiado en responder.", { status: 504 });
    }
    console.error("Error en el orquestador:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}