

import {CharInterface } from "@/components/chat-interface"
import { notFound } from "next/navigation";
import { chatRepo } from "@/lib/repositories/instances";
//import {ChatRepository} from "@/lib/repositories/chat-repository";

interface PageProps {
  params: Promise<{ id: string }> 
}

export default async function ChatPage({ params }: PageProps) {
  const { id: chatId } = await params

const chat = await chatRepo.getFindIdDocumentChat(chatId);


if (!chat) return notFound;

  return <CharInterface chatId={chatId} docId={chat.document_id} />
}