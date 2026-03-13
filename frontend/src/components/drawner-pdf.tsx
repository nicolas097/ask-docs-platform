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
  pdfUrl: string;
  updateTrigger: number;


}
export function DrawerDemo({ chatId, pdfUrl, updateTrigger }: ChatInterfaceProps) {

  const [activePage, setActivePage] = React.useState(1);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="gap-2">
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
                <PDFViewerDynamic url={pdfUrl} targetPage={activePage} chatId={chatId} updateTrigger={updateTrigger} />
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
