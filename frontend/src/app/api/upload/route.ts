

import { Storage } from '@google-cloud/storage';
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";


export async function POST(request: NextRequest) {
  try {
        const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("--- DIAGNÓSTICO DE CREDENCIALES ---");
  console.log("Email leído:", process.env.GCP_CLIENT_EMAIL);
  console.log("Largo del Project ID:", process.env.GCP_PROJECT_ID?.length);
  console.log("¿Tiene Private Key?:", process.env.GCP_PRIVATE_KEY ? "SÍ" : "NO");
  console.log("-----------------------------------");

    const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      // IMPORTANTE: El replace arregla los saltos de línea de la llave privada
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  });

  const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);
  const blob = bucket.file(file.name);
 
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blob.save(buffer, {
    contentType: file.type,
  });

   const fileName = file.name; 
  const fileSize = file.size; // Tamaño en bytes

    const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${file.name}`;

      return NextResponse.json({ 
      success: true,
      message: "Archivo subido exitosamente", 
      filePath: publicUrl,
      name: fileName, 
      size: fileSize   
    });

    


  }catch(error){
        console.error("Error al subir archivo:", error);
    return NextResponse.json(
      { error: "Error interno al subir el archivo" },
      { status: 500 }
    );
  }




}

// export async function POST(request: NextRequest) {
//   try {
//     // 1. Obtener el FormData
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     // 2. Validaciones básicas
//     if (!file) {
//       return NextResponse.json(
//         { error: "No se recibió ningún archivo" },
//         { status: 400 }
//       );
//     }

//     // Validar que sea PDF (opcional, pero recomendado para tu proyecto)
//     if (file.type !== "application/pdf") {
//         return NextResponse.json(
//           { error: "Solo se permiten archivos PDF" },
//           { status: 400 }
//         );
//     }

//     // 3. Convertir el archivo a Buffer para poder guardarlo
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // 4. Definir la ruta de guardado (public/uploads/YYYY-MM-DD)
//     const dateFolder = new Date().toISOString().split("T")[0];
//     // Usamos process.cwd() para asegurar la ruta raíz del proyecto
//     const uploadDir = path.join(process.cwd(), "public", "uploads", dateFolder);

//     // 5. Crear la carpeta si no existe
//     if (!existsSync(uploadDir)) {
//       await mkdir(uploadDir, { recursive: true });
//     }

//     // 6. Generar nombre único y guardar
//     // Limpiamos el nombre original de espacios y caracteres raros
//     const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//     const finalFileName = `${Date.now()}-${sanitizedFileName}`;
//     const filePath = path.join(uploadDir, finalFileName);

//     await writeFile(filePath, buffer);

//     // 7. Retornar la ruta pública para que el frontend la use
//     // La URL pública no lleva "public", empieza desde la raíz
//     const publicUrl = `/uploads/${dateFolder}/${finalFileName}`;

//     return NextResponse.json({ 
//       message: "Archivo subido exitosamente", 
//       filePath: publicUrl,
//       fileName: finalFileName
//     });

//   } catch (error) {
//     console.error("Error al subir archivo:", error);
//     return NextResponse.json(
//       { error: "Error interno al subir el archivo" },
//       { status: 500 }
//     );
//   }
// }