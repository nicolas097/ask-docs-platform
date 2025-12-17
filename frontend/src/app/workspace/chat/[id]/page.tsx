

import {CharInterface } from "@/components/chat-interface"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ url?: string }> // <--- Next.js nos da esto gratis
}

export default async function ChatPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { url } = await searchParams // Leemos la URL de la barra de direcciones

  // Si no viene URL en los params, usamos una vacía o tu demo como fallback final
  const currentPdfUrl = url || "" 

  return <CharInterface chatId={id} pdfUrl={currentPdfUrl} />
}