"use client"

import dynamic from 'next/dynamic'

export const PDFViewerDynamic = dynamic(() => import("./pdf-viewer"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center animate-pulse">
      <span className="text-sm text-muted-foreground">Iniciando visor de documentos...</span>
    </div>
  )
});