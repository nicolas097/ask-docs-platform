import { create } from 'zustand';

interface ChatStore {
  chatId: string | null;
  pdfUrl: string | null;
  updateTrigger: number;
  setChatData: (id: string, url: string) => void;
  triggerPdfUpdate: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: null,
  pdfUrl: null,
  updateTrigger: 0,
  
  // Función para guardar el ID del chat y el PDF cuando entras a la página
  setChatData: (id, url) => set({ chatId: id, pdfUrl: url }),
  
  // Función para cambiar el número y avisarle al PDF que busque páginas nuevas
  triggerPdfUpdate: () => set({ updateTrigger: Date.now() }),
}));