"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useIsMobile } from "@/hooks/use-mobile"
import React, { useState, useEffect } from 'react';
import { ChatArea } from "@/components/chat-area"
import { DrawerDemo } from "./drawner-pdf";
import dynamic from 'next/dynamic';
import { PDFViewerDynamic } from "@/components/pdf-dynamic";

interface ChatInterfaceProps {
  chatId?: string
  pdfUrl: string
}
export function CharInterface({ chatId, pdfUrl }: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = React.useState(1);
  const decodedUrl = pdfUrl ? decodeURIComponent(pdfUrl) : "";
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div className="h-screen w-full bg-background" />;
  }

  if (isMobile) {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
        <div className="h-full w-full">
          <ChatArea />
        </div>

        <div className="absolute top-4 right-4 z-50">
          <DrawerDemo chatId={chatId} pdfUrl={pdfUrl} />
        </div>
      </div>
    );
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
          {decodedUrl ? (
            <PDFViewerDynamic url={decodedUrl} targetPage={activePage} />
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