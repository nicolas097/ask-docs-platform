"use client"

import { Children, createContext, useContext, useState, ReactNode} from "react";

// 1. Creamos el contexto

interface TitleContextType {
    title: string | null;
    setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>("Selecciona un chat");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle debe usarse dentro de un TitleProvider");
  }
  return context;
}