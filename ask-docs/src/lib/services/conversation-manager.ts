import { toBaseMessages } from '@ai-sdk/langchain';
import { aiService } from "./ai-service";
import { chatRepo, docRepo, srcRepo } from "@/lib/repositories/instances";
import { generateTitle } from "@/lib/services/ai-titler";
import { revalidatePath } from 'next/cache';





export class ConversationManager {
  static async processMessage(chatId: string, messages: any[]) {



    //1  recepcion del mensaje 
    const lastMessage = messages[messages.length - 1];
    let lastUserMessage = '';



    // if (typeof lastMessage.content === 'string' && lastMessage.content !== '') {
    //   lastUserMessage = lastMessage.content;
    // } else if (Array.isArray(lastMessage.parts)) {
    //   const textPart = lastMessage.parts.find((p: any) => p.type === 'text');
    //   if (textPart) {
    //     lastUserMessage = textPart.text;
    //   }
    // 
    if (typeof lastMessage.content == 'string' && lastMessage.content !== '') {
      lastUserMessage = lastMessage.content;
    }


    if (Array.isArray(lastMessage.parts)) {
      const textPart = lastMessage.parts.find((p: any) => p.type === 'text');
      if (textPart) {
        lastUserMessage = textPart.text;

      }

      console.log('Paso por a')

    }

    if (!lastUserMessage) {
      console.error("Payload del mensaje fallido:", JSON.stringify(lastMessage, null, 2));
      throw new Error("El contenido del mensaje llegó vacío al orquestador.");
    }



    await chatRepo.addMessage({ chatId, role: 'user', content: lastUserMessage });



    const { document_id } = await chatRepo.getFindIdDocumentChat(chatId);
    //  Transforma el texto en un vector 
    const queryVector = await aiService.getEmbeddings().embedQuery(lastUserMessage);
    const chunks = await docRepo.findRelevantChunks(document_id, queryVector);
    console.log('chuks', chunks);


    const pageNumber = [...new Set(chunks.map(c => c.page_number))];


    const context = chunks.map(c => `[Pág ${c.page_number}]: ${c.content}`).join("\n\n");
    console.log(context)

    const systemPrompt = `Eres un analista técnico experto. Usa este contexto: ${context}`;



    const historyChat = await chatRepo.getHistory(chatId);

    let fakeData: any = [{
      parts: [{ type: 'text', text: 'en donde puedo pagar esta boleta ' }],
      id: '68baf4c1-5d4f-48cb-a133-2a300089da18',
      role: 'user'
    }]


    if (!historyChat || historyChat.length === 1) {

      //Generamos el título y actualizamos
      const titulo = await generateTitle(lastUserMessage);
      await chatRepo.updateTitle(chatId, titulo);

      revalidatePath('/workspace/chat');
    }

    const langchainMessages = await toBaseMessages(messages);
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...langchainMessages
    ];


    const tecnologias = ["Next.js", "PostgreSQL", "LangChain", "TypeScript", "Tailwind CSS"];


    const modelChatGenerative = aiService.getGenerativeChat();


    return await modelChatGenerative.stream(finalMessages, {
      callbacks: [
        {
          handleLLMEnd: async (output) => {
            try {

              const aiResponseText = output.generations[0][0].text;

              const messageId = await chatRepo.addMessage({
                chatId: chatId,
                role: 'assistant',
                content: aiResponseText
              });


              for (const page of pageNumber) {

                await srcRepo.insertMessageSource({
                  message_id: messageId,
                  documentId: document_id,
                  page_number: page
                });
              }

              



              console.log("Respuesta de Gemini guardada exitosamente en BD");
            } catch (error) {
              console.error("Error guardando respuesta de Gemini en BD:", error);
            }
          }
        }
      ]
    });
  }


}