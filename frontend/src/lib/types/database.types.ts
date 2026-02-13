


export interface CreateDocumentDTO {
  fileName: string;
  fileSize: number;
  gcsPath: string;
}

export interface CreateChatDTO {
  documentId: string; 
  title?: string;
}

export interface InsertChunkDTO {
  documentId: string;
  content: string;
  embedding: number[];
  metadata: {
    pageNumber: number;
    [key: string]: any;
  };
}