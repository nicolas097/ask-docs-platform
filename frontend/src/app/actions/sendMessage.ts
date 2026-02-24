import { chatRepo } from "@/lib/repositories/instances";
import {generateTitle} from "@/lib/services/ai-titler"

export async function sendMessageAction(chatId: string, content: string) {
  // 1. Guardar el mensaje (usando el repo)
  await chatRepo.addMessage({ chatId, role: 'user', content });

  const history = await chatRepo.getHistory(chatId);

  if (history.length === 1) {
    const newTitle = await generateTitle(content);
    await chatRepo.updateTitle(chatId, newTitle);
  }
}

