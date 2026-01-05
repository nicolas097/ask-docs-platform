'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { Minus, Plus, Eye } from "lucide-react"
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
  const MIN_SCALE = 0.5; // 50%
  const MAX_SCALE = 2.5; // 250%


  useEffect(() => {

    const handler = setTimeout(() => {
      setDebouncedWidth(width);
    }, 150);


    return () => clearTimeout(handler);
  }, [width]);


  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {

        setDebouncedWidth(width);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [width]);

  const WINDOW_SIZE = 1;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getVisiblePages = () => {
    if (!numPages) return [];
    const validTarget = targetPage > 0 ? targetPage : 1;
    const start = Math.max(1, validTarget - 2);
    const end = Math.min(numPages, start + WINDOW_SIZE - 1);
    const pages = [];
    for (let i = start; i <= end; i++) { pages.push(i); }
    return pages;
  };

  if (!isClient) return <div className="h-full w-full bg-slate-100" />;

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] bg-slate-100 overflow-hidden">
      <div className="p-2 bg-white border-b text-[2vh] text-slate-500 flex justify-between px-4">
        <div className="">
          <Button className="rounded-2xl" onClick={() => setScale(s => Math.max(MIN_SCALE, s - 0.1))}
            disabled={scale <= MIN_SCALE}>
            <Minus />

          </Button>
          <Button className="rounded-2xl" onClick={() => setScale(s => Math.min(MAX_SCALE, s + 0.1))}
            disabled={scale >= MAX_SCALE}>
            <Plus />
          </Button>
          {/* <span> Scale: {(scale * 100).toFixed(0)}% </span> */}
        </div>



        <span>PÁGS: {numPages || '---'}</span>
      </div>


      <div ref={containerRef} className="flex-1 overflow-auto p-4 space-y-8 bg-slate-200/50">
        {error ? (
          <div className="text-red-500 p-10 text-center text-sm">
            Fallo al cargar PDF: {error}
            <br />
            <span className="text-xs text-gray-400">Verifica la consola y el CORS</span>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => setError(err.message)} // CAPTURA EL ERROR
            loading={<div className="p-10 text-center animate-bounce">Cargando Documento...</div>}
          >
            {getVisiblePages().map((pg) => (
              <div key={`page-${pg}`} className="flex flex-col items-center gap-2">
                <div className="shadow-2xl border border-slate-300 bg-white">
                  <Page
                    renderAnnotationLayer={false}
                    pageNumber={pg}
                    width={debouncedWidth ? Math.floor(debouncedWidth) : 400}
                    renderTextLayer={true}
                    loading={<div style={{ height: '400px', width: '300px' }} className="bg-white" />}
                    onRenderError={(err) => console.log("Render cancelado:", err.message)}
                    scale={scale}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">PÁGINA {pg}</span>
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}