import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, FileText, Clock, ArrowRight, FilePlusCorner } from "lucide-react"
import {UploadButton} from "@/components/new-document-button"
import Link from "next/link" // Iconos de Lucide (vienen con shadcn)

export default function Page() {
  return (

    <div className="h-screen grid place-items-center">
      <div className="p-4">

        <div className="grid grid-row-1 md:grid-cols-1 gap-4 mb-8 ">

          <div className="flex justify-center">
            <FilePlusCorner className="w-20 h-20 md:w-40 md:h-40 text-blue-500" />
          </div>
          <div className="flex flex-col justify-center gap-5">
            <h1 className="font-semibold text-xl md:text-5xl" >¡Bienvenido a Ask-Docs!</h1>
            <p className="font-normal text-xl">Tu Asistente de lectura inteligente. Sube tu PDF para comenzar.</p>
            {/* <Button className="bg-blue-500  rounded-2xl md:h-16 hover:bg-sky-700">
              <Plus className="!w-6 !h-6 md:!w-10 md:!h-10" />
              <span className="font-semibold text-sm md:text-2xl">
                Subir tu primer PDF.
              </span>
            </Button> */}
            <UploadButton/>
          </div>


        </div>




      </div>
    </div>

  )
}









