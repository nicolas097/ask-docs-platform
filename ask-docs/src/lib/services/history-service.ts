// src/lib/services/history-service.ts
import { chatRepo } from "@/lib/repositories/instances";
import { Message } from "@/lib/types/database.types";

export const HistoryService = {
  async getValidHistory(chatId: string): Promise<Message[]> {
    const rawMessages = await chatRepo.getHistory(chatId);

    // Tu lógica de validación profesional
    if (!rawMessages || rawMessages.length <= 1) return [];

    return rawMessages.map((row: any) => ({
      id: row.id.toString(),
      role: row.role as 'user' | 'assistant',
      content: row.content,
      // CREACIÓN DINÁMICA DE PARTS: Esto quita el error de image_547c3b.png
      parts: [{ type: 'text', text: row.content || '' }],
      createdAt: new Date(row.created_at)
    }));
  }
};