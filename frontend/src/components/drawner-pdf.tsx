"use client"

import * as React from "react"
import { Minus, Plus, Eye } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import PDFViewer from "@/components/pdf-viewer"
import { PDFViewerDynamic } from "@/components/pdf-dynamic";

import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"


interface ChatInterfaceProps {
  chatId?: string
  pdfUrl: string
}
export function DrawerDemo({ chatId, pdfUrl }: ChatInterfaceProps) {

  const [activePage, setActivePage] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const decodedUrl = pdfUrl ? decodeURIComponent(pdfUrl) : "";
  const [scale, setScale] = useState<number>(1.0);

  const handleZoomIn = ()   => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setScale(1.0);


  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Ver PDF
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Visor PDF</DrawerTitle>
          </DrawerHeader>
          <div>
            <div className="h-[58vh]">
              {pdfUrl ? (
                <PDFViewerDynamic url={decodedUrl} targetPage={activePage}   />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No se ha cargado ningún PDF
                </div>
              )}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
