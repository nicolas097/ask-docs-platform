"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTitle } from "@/context/TitleDocuments";
import { useIsMobile } from '@/hooks/use-mobile';
import { useChatStore } from '@/store/useChatStore';
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerHeader, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { DrawerDemo } from "@/components/drawner-pdf"
import { Eye } from "lucide-react";


export function SiteHeader() {
  const isMobile = useIsMobile();
  const { chatId, pdfUrl, updateTrigger } = useChatStore();

  const { title } = useTitle();
  return (
    <header className="sticky top-0 z-20 bg-background flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title ? title : "Selecciona una conversación"}</h1>


        <div className="ml-auto flex items-center gap-1">

          {isMobile && chatId && pdfUrl && (
            <DrawerDemo chatId={chatId} pdfUrl={pdfUrl} updateTrigger={updateTrigger} />
          )}

        </div>

      </div>
    </header>
  )
}
