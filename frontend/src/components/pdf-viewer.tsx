'use client'
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  url: string;
  targetPage: number;
  chatId? : string;
  updateTrigger: number;
}

export default function PDFViewer({ url, targetPage, chatId, updateTrigger }: Props) {
    const router = useRouter()
  const [numPages, setNumPages] = useState<number>();
  const [numberPages, setNumberpages] = useState([1]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState<boolean>(false);
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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

 const fetchPages = async () => {
  try {
    const response = await fetch(`/api/pdf/pages/${chatId}`);
    const data = await response.json();
    
    if (data) {
      setNumberpages(data);
      
      
    }

  
  } catch (error) {
    console.error("Error al extraer páginas:", error);
  }
};


useEffect(() => {
  if (chatId) {
    fetchPages();
  }
}, [chatId]);


useEffect(() => {
    if (updateTrigger > 0) {
      console.log("El Chat avisó que terminó. Yendo a buscar nuevas páginas...");
      
      fetchPages(); 
    }
  }, [updateTrigger]);

useEffect(() => {
  if (numberPages && numberPages.length > 0) {
    router.refresh(); 
  }
}, [numberPages]);



  console.log(numberPages);

  // const getVisiblePages = () => {
  //   if (!numPages) return [];
  //   const validTarget = targetPage > 0 ? targetPage : 1;
  //   const start = Math.max(1, validTarget - 2);
  //   const end = Math.min(numPages, start);
  //   const pages = [];
  //   for (let i = start; i <= end; i++) { pages.push(i); }
  //   return pages;
  // };

  if (!isClient) return <div className="h-full w-full bg-slate-100" />;

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] bg-slate-100 overflow-hidden">
      <div className="p-2 bg-white border-b flex justify-between px-5 items-center">
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

        <div className='flex items-center justify-center gap-2 sm:gap-4 mt-6 mb-4 w-full px-2'>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="bg-white px-2 sm:px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>

          <span className="text-xs sm:text-sm font-medium text-slate-600 bg-white px-2 sm:px-3 py-1.5 rounded-md shadow-sm border whitespace-nowrap">
            Pág. {pageNumber} de {numPages || '---'}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
            disabled={!numPages || pageNumber >= numPages}
            className="bg-white px-2 sm:px-3"
          >
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <span className="text-xs font-mono text-slate-500">PÁGS: {numPages || '---'}</span>
      </div>

      <div className="flex-1 relative min-w-0 min-h-0 bg-slate-200/50">

        <div
          ref={containerRef}
          className="absolute inset-0 overflow-auto p-4"
          style={{
            touchAction: scale > 1 ? 'pan-x pan-y' : 'pan-y',
            WebkitOverflowScrolling: 'touch'
          }}
          onPointerDown={(e) => scale > 1 && e.stopPropagation()}
        >

          <div className={`flex flex-col gap-8 min-w-full ${scale > 1 ? 'items-start' : 'items-center'}`}>

            <div className="flex flex-col items-center w-max min-w-full mx-auto">
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess} 
                        loading={<div className="p-10 text-center animate-pulse ">Cargando...</div>}>

                 {numberPages.map(item => <Page
                  key={item}
                  renderAnnotationLayer={false}
                  pageNumber={item}
                  scale={scale} 
                  width={debouncedWidth ? Math.floor(debouncedWidth) : 400}
                /> )}
             
              </Document>


            </div>
          </div>



        </div>
      </div>
    </div>
  );
}