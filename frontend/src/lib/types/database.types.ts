


export interface CreateDocumentDTO {
  fileName: string;
  fileSize: number;
  gcsPath: string;
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


export interface CreateChatDTO {
  title: string;
  userId?: string; 
  documentId?: string;
}

export interface CreateMessageDTO {
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
}