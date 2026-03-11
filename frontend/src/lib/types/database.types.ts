


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


export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  content: string; // Texto plano para la DB y LangChain
  parts: {         // Arreglo de objetos para el frontend multimodal
    type: 'text'; 
    text: string 
  }[];
  createdAt?: Date;
}

export interface MessageSource {
  id?: string;
  message_id: string,
  documentId: string,
  page_number : number,
}