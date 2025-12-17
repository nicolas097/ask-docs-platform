"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"
import React from 'react';
import PDFViewer from "@/components/pdf-viewer";
import { ChatArea } from "@/components/chat-area"

interface ChatInterfaceProps {
  chatId?: string
  pdfUrl: string // <--- Quitamos el "?" para hacerlo obligatorio
}
export function CharInterface({ chatId, pdfUrl }: ChatInterfaceProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <h1 className="bg-amber-300">Hola nicolas</h1>
  }

  return (

    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen w-full"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
        <ChatArea />
          
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="h-full w-full">
         {pdfUrl ? (
             <PDFViewer url={pdfUrl} />
           ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">
                No se ha cargado ningún PDF
             </div>
           )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>


  )
}