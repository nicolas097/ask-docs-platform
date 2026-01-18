'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { Minus, Plus } from "lucide-react"
import { Button } from './ui/button';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  url: string;
  targetPage: number;
}

export default function PDFViewer({ url, targetPage }: Props) {
  const [numPages, setNumPages] = useState<number>();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width, ref: containerRef } = useResizeDetector();
  const [debouncedWidth, setDebouncedWidth] = useState(width);
  const [scale, setScale] = useState(1.0);
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.5;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedWidth(width), 150);
    return () => clearTimeout(handler);
  }, [width]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getVisiblePages = () => {
    if (!numPages) return [];
    const validTarget = targetPage > 0 ? targetPage : 1;
    const start = Math.max(1, validTarget - 2);
    const end = Math.min(numPages, start); 
    const pages = [];
    for (let i = start; i <= end; i++) { pages.push(i); }
    return pages;
  };

  if (!isClient) return <div className="h-full w-full bg-slate-100" />;

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] bg-slate-100 overflow-hidden">
      <div className="p-2 bg-white border-b flex justify-between px-4 items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8" 
            onClick={() => setScale(s => Math.max(MIN_SCALE, s - 0.1))}
            disabled={scale <= MIN_SCALE}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8" 
            onClick={() => setScale(s => Math.min(MAX_SCALE, s + 0.1))}
            disabled={scale >= MAX_SCALE}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xs font-mono text-slate-500">PÁGS: {numPages || '---'}</span>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 bg-slate-200/50"
        style={{
          touchAction: scale > 1 ? 'pan-x pan-y' : 'pan-y',
          WebkitOverflowScrolling: 'touch'
        }}
        onPointerDown={(e) => scale > 1 && e.stopPropagation()}
      >
        {error ? (
          <div className="text-red-500 p-10 text-center text-sm">Fallo al cargar PDF: {error}</div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => setError(err.message)}
            loading={<div className="p-10 text-center animate-pulse">Cargando...</div>}
          >
       
            <div className={`flex flex-col gap-8 min-w-full ${scale > 1 ? 'items-start' : 'items-center'}`}>
              {getVisiblePages().map((pg) => (
                <div 
                  key={`page-${pg}`} 
                  className="flex flex-col gap-2"
                  style={{
                    transformOrigin: '0 0', 
                  }}
                >
                  <div className="shadow-2xl border border-slate-300 bg-white">
                    <Page
                      renderAnnotationLayer={false}
                      pageNumber={pg}
                      width={debouncedWidth ? Math.floor(debouncedWidth) : 400}
                      scale={scale}
                      renderTextLayer={true}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 text-center">PÁGINA {pg}</span>
                </div>
              ))}
            </div>
          </Document>
        )}
      </div>
    </div>
  );
}