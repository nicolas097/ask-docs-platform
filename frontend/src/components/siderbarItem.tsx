"use client";
import { useTitle } from "@/context/TitleDocuments";

// Define la interfaz según lo que devuelva tu chatRepo
interface ChatDoc {
  id: string;
  title: string;
}

export function SidebarItem({ chat }: { chat: ChatDoc }) {
  // Aquí SÍ podemos usar el hook porque es un Client Component
  const { setTitle } = useTitle();

  return (
    <div 
      onClick={() => setTitle(chat.title)}
      className="cursor-pointer p-2 hover:bg-gray-200"
    >
      {chat.title}
    </div>
  );
}