"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleArrowUpIcon, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export  function UploadButton() {

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
        console.log(data);
        
     
        const uploadedUrl = data.filePath 

        console.log("Archivo guardado en:", uploadedUrl)
        console.log("Redirigiendo al workspace...")
        
        const fakeId = "demo-1"

        router.push(`/workspace/chat/${fakeId}?url=${encodeURIComponent(uploadedUrl)}`)

      } catch (error) {
        console.error("Falló la subida:", error)
        
      }
  }
  }

  return (
    <>
      <Button
        className="bg-blue-500  rounded-2xl md:h-16 hover:bg-sky-700"
        onClick={handleButtonClick}
      >
        <Plus className="!w-6 !h-6 md:!w-10 md:!h-10" />

        <span className="font-semibold text-sm md:text-2xl">
          Subir tu primer PDF.
        </span>
      </Button>

      {/* <Button 
        className="bg-gray-200 text-gray-950 hover:bg-gray-300"
        onClick={handleButtonClick} 
      >
        <CircleArrowUpIcon className="mr-2 h-4 w-4" />
        Nuevo PDF
      </Button> */}

      <Input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />


    </>
  )
}