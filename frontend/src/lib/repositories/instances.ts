import { pool } from "@/lib/db";
import { ChatRepository } from "./chat-repository";
import {DocumentRepository} from "./document-repository"


export const chatRepo = new ChatRepository(pool);

export const docRepo = new DocumentRepository(pool);


