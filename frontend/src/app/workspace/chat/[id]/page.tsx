

import { CharInterface } from "@/components/chat-interface"
import { notFound } from "next/navigation";
import { chatRepo } from "@/lib/repositories/instances";
import { HistoryService } from "@/lib/services/history-service";
import { TitleUpdater } from "@/components/title-updater";
//import {ChatRepository} from "@/lib/repositories/chat-repository";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: PageProps) {
  const { id: chatId } = await params

  const chat = await chatRepo.getFindIdDocumentChat(chatId);
  const TitleChat = await chatRepo.getFindTitle(chatId);




  if (!chat) return notFound;

  return (
    <>
      <TitleUpdater title={TitleChat?.title || "Chat sin título"} />
      <CharInterface chatId={chatId} docId={chat.document_id} />
    </>

  )
}