"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleArrowUpIcon, Download, Plus, Loader2,CheckCircle, AlertCircle} from "lucide-react"
import { useRouter } from "next/navigation"
import { downloadFileFromGCSAction } from "@/app/actions/donwload"
import { ingestDocumentAction } from "@/app/actions/ingest"

export function UploadButton() {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string>('IDLE');
  const [docId, setDocId] = useState<string | null>(null);
  const router = useRouter();

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setStatus('UPLOADING');
    if (file) {
      console.log("Archivo seleccionado:", file.name)


      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Error en la subida")
        }


        const data = await response.json();

        // 'data.name' es el nombre que devuelve tu API /api/upload
        const result = await ingestDocumentAction(data.name, data.size);
        if (result.success) {
          setDocId(result.docId || null);
          setStatus('PROCESSING'); // ¡Aquí empieza la espera visual!
        } else {
          // Aquí TypeScript sabe que result tiene "error"
          console.error(result.error);
          alert("Hubo un error iniciando la ingesta");
        }

        // if (result.success) {

        //   // 3. Redirección
        //   router.push(`/workspace/${encodeURIComponent(data.name)}`);
        // } else {
        //   throw new Error(result.error || "El servidor no pudo leer el archivo");
        // }



        // const result = await ingestDocumentAction(data.name, data.size);


        // if (result){
        //   console.log("Se logró guardad en la bd")
        // }else{
        //   console.log("no se logro guardar");
        // }


        console.log("Archivo guardado en:", data)
        console.log("Redirigiendo al workspace...")



      } catch (error) {
        console.error("Falló la subida:", error)

      }
    }
  }

  useEffect(() => {
    if (status === 'PROCESSING' && docId) {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/documents/${docId}/status`);
        const data = await res.json();

        if (data.status === 'COMPLETED') {
          setStatus('COMPLETED');
          clearInterval(interval); // Dejar de preguntar
        } else if (data.status === 'FAILED') {
          setStatus('ERROR');
          clearInterval(interval);
        }
        // Si sigue PROCESSING, no hacemos nada, volverá a preguntar en 2s
      }, 2000); // Preguntar cada 2 segundos

      return () => clearInterval(interval);
    }
  }, [status, docId]);

  return (
    <>


      {status === 'IDLE' && (
          <Button
            className="bg-blue-500 rounded-2xl md:h-16 hover:bg-sky-700 transition-all"
            onClick={handleButtonClick}
          >
            <Plus className="!w-6 !h-6 md:!w-10 md:!h-10 mr-2" />
            <span className="font-semibold text-sm md:text-2xl">
              Subir tu primer PDF
            </span>
          </Button>
      )}

      {status === 'UPLOADING' && (
          <Button disabled className="bg-blue-400 rounded-2xl md:h-16 cursor-not-allowed">
            <Loader2 className="animate-spin mr-2 h-6 w-6" />
            <span className="text-xl">Subiendo...</span>
          </Button>
      )}

      {status === 'PROCESSING' && (
          <div className="flex flex-col items-center text-blue-600 animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin mb-2" />
            <span className="font-medium">Analizando documento con IA...</span>
            <span className="text-xs text-gray-400">Esto puede tomar unos momentos</span>
          </div>
      )}

      {status === 'COMPLETED' && (
          <div className="flex flex-col items-center text-green-600">
             <CheckCircle className="h-12 w-12 mb-2" />
             <span className="font-bold text-xl">¡Listo! Documento procesado.</span>
             <Button variant="outline" onClick={() => setStatus('IDLE')} className="mt-4">
                Subir otro
             </Button>
          </div>
      )}

      {status === 'ERROR' && (
          <div className="text-red-500 flex flex-col items-center">
             <AlertCircle className="h-10 w-10 mb-2"/>
             <span>Ocurrió un error. Intenta nuevamente.</span>
             <Button variant="ghost" onClick={() => setStatus('IDLE')} className="mt-2 text-blue-500">
                Reintentar
             </Button>
          </div>
      )}

      {/* INPUT OCULTO SIEMPRE PRESENTE */}
      <Input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />


      {/* <Button
        className="bg-blue-500  rounded-2xl md:h-16 hover:bg-sky-700"
        onClick={handleButtonClick}
      >
        <Plus className="!w-6 !h-6 md:!w-10 md:!h-10" />

        <span className="font-semibold text-sm md:text-2xl">
          Subir tu primer PDF.
        </span>
      </Button>


      <Input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      /> */}


    </>
  )
}