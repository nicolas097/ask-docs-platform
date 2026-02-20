import { Bucket, Storage } from "@google-cloud/storage";
import path from "path";


const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS!);

export const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: keyPath,
});

export async function getGCSBucket(GCP_BUCKET_NAME: string): Promise<Bucket> {

    try {
        const bucket = await storage.bucket(GCP_BUCKET_NAME);
        const [exists] = await bucket.exists();

        if (!exists) {
            throw new Error(`El bucket ${GCP_BUCKET_NAME} no existe.`);
        }

        return bucket;

    } catch (error: any) {
        console.error(error)
        throw error;
    }


}