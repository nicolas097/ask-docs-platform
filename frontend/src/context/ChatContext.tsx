'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos la interfaz para el "ojo humano" y el compilador
interface ChatContextType {
  chatId: string | null;
  setChatId: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ chatId, setChatId }}>
      {children}
    </ChatContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext debe usarse dentro de un ChatProvider');
  }
  return context;
}