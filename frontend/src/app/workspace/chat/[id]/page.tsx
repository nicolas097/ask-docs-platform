

import {CharInterface } from "@/components/chat-interface"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ url?: string }> 
}

export default async function ChatPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { url } = await searchParams 
  

  const currentPdfUrl = url || "" 

  return <CharInterface chatId={id} pdfUrl={currentPdfUrl} />
}