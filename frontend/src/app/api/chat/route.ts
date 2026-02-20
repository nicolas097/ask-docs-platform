import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse} from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { google } from "@ai-sdk/google";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { aiService } from '@/lib/services/ai-service';

export const maxDuration = 15;

export async function POST(req: Request) {
 const { chatId, messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;


  const modelAi = aiService.getGenerativeChat()
  const langchainMessages = await toBaseMessages(messages);

  try {
    const stream = await modelAi.stream(langchainMessages, {
      signal: AbortSignal.timeout(60000) 
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return new Response("El modelo tardó demasiado en responder.", { status: 504 });
    }
    throw error;
  }


}