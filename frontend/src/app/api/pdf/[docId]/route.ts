import { Storage } from "@google-cloud/storage";
import Pool, { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { getGCSBucket } from "@/lib/gcs";
import {docRepo} from "@/lib/repositories/instances"


export async function GET(req: Request, { params }: { params: { docId: string } }) {
    try {
        const { docId } = await params;


        const docGCSpath = await docRepo.getFindGcsPath(docId);

        if (!docGCSpath) return new Response("No encontrado", { status: 404 })
        

        const { gcs_path, mime_type } = docGCSpath;

        const bucket = await getGCSBucket(process.env.GCP_BUCKET_NAME!);

        const file = bucket.file(gcs_path);

        const [downloadedBuffer] = await file.download();

        const blob = new Blob([new Uint8Array(downloadedBuffer)]);

        return new NextResponse(blob, {
            headers: {
                "Content-Type": mime_type || "application/pdf", 
                "Content-Disposition": "inline",
                "X-Content-Type-Options": "nosniff", 
            },
        });


    } catch (error) {
      console.error("Error pdf:", error);
    return new Response("Error interno", { status: 500 });
    }
}