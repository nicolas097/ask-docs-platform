import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse } from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { google } from "@ai-sdk/google";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const maxDuration = 15;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const result = streamText({
  //   model: google("gemini-2.5-flash"),
  //   messages: await convertToModelMessages(messages),
  // });

  const modelAi = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  })



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



  //   const stream = await modelAi.stream(langchainMessages);


  //  return createUIMessageStreamResponse({
  //     stream: toUIMessageStream(stream),
  //   });
}