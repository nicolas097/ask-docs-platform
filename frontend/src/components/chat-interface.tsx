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
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background flex flex-col">
   
      <div className="h-5 w-full  bg-background flex items-center px-4 relative z-20">
       
        <div className="absolute top-2.5 right-4 z-30">
          <DrawerDemo chatId={chatId} pdfUrl={pdfUrl} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatArea />
      </div>
    </div>
  );
}
  return (

<ResizablePanelGroup 
  direction="horizontal"
  className="h-screen w-full border overflow-hidden" 
>
  {/* PANEL 1: CHAT INTERFACE */}
  <ResizablePanel 
    defaultSize={40} 
    minSize={25}
  >
  
    <div className="bg-background">
      <ChatArea />
    </div>
  </ResizablePanel>

  <ResizableHandle withHandle />

  <ResizablePanel 
    defaultSize={60} 
    minSize={40}
  >
    <div className="h-full w-full overflow-hidden bg-slate-100">
      {decodedUrl ? (
        <PDFViewerDynamic 
          url={decodedUrl} 
          targetPage={activePage} 
        />
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