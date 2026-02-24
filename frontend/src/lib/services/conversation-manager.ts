import { toBaseMessages } from '@ai-sdk/langchain';
import { aiService } from "./ai-service";
import { chatRepo, docRepo } from "@/lib/repositories/instances";
import { generateTitle } from "@/lib/services/ai-titler";



export class ConversationManager {
  static async processMessage(chatId: string, messages: any[]) {

    const lastMessage = messages[messages.length - 1];
    let lastUserMessage = '';



    // if (typeof lastMessage.content === 'string' && lastMessage.content !== '') {
    //   lastUserMessage = lastMessage.content;
    // } else if (Array.isArray(lastMessage.parts)) {
    //   const textPart = lastMessage.parts.find((p: any) => p.type === 'text');
    //   if (textPart) {
    //     lastUserMessage = textPart.text;
    //   }
    // }

    if (typeof lastMessage.content == 'string' && lastMessage.content !== ''){
       lastUserMessage = lastMessage.content;
    }


    if (Array.isArray(lastMessage.parts)) {
      const textPart = lastMessage.parts.find((p: any) => p.type === 'text');
      if (textPart){
        lastUserMessage = textPart.text;

      }
    }

    if (!lastUserMessage) {
      console.error("Payload del mensaje fallido:", JSON.stringify(lastMessage, null, 2));
      throw new Error("El contenido del mensaje llegó vacío al orquestador.");
    }




    await chatRepo.addMessage({ chatId, role: 'user', content: lastUserMessage });



    const { document_id } = await chatRepo.getFindIdDocumentChat(chatId);
    const queryVector = await aiService.getEmbeddings().embedQuery(lastUserMessage);
    const chunks = await docRepo.findRelevantChunks(document_id, queryVector);

    const context = chunks.map(c => `[Pág ${c.page_number}]: ${c.content}`).join("\n\n");

    const systemPrompt = `Eres un analista técnico experto. Usa este contexto: ${context}`;



    const historyChat = await chatRepo.getHistory(chatId);


    if (!historyChat || historyChat.length === 1) {

      //Generamos el título y actualizamos
      const titulo = await generateTitle(lastUserMessage);
      await chatRepo.updateTitle(chatId, titulo);
    }

    const langchainMessages = await toBaseMessages(messages);
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...langchainMessages
    ];

    const modelChatGenerative = aiService.getGenerativeChat();


    return await modelChatGenerative.stream(finalMessages, {
      callbacks: [
        {
          handleLLMEnd: async (output) => {
            try {

              const aiResponseText = output.generations[0][0].text;

              await chatRepo.addMessage({
                chatId: chatId,
                role: 'assistant',
                content: aiResponseText
              });

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