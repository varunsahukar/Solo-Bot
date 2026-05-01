import Dexie, { Table } from "dexie";

export interface Document {
  doc_id: string;
  name: string;
  content: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id?: number;
  doc_id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

class SoloTutorDB extends Dexie {
  documents!: Table<Document>;
  messages!: Table<ChatMessage>;

  constructor() {
    super("SoloTutorDB");
    this.version(1).stores({
      documents: "doc_id, name, uploadedAt",
      messages: "++id, doc_id, timestamp"
    });
  }
}

const db = new SoloTutorDB();

export function useIndexedDB() {
  const addDocument = async (doc: Document) => {
    await db.documents.put(doc);
  };

  const getDocument = async (doc_id: string) => {
    return await db.documents.get(doc_id);
  };

  const getAllDocuments = async () => {
    return await db.documents.toArray();
  };

  const addMessage = async (message: ChatMessage) => {
    await db.messages.put(message);
  };

  const getMessages = async (doc_id?: string) => {
    if (doc_id) {
      return await db.messages.where("doc_id").equals(doc_id).sortBy("timestamp");
    }
    return await db.messages.orderBy("timestamp").toArray();
  };

  return {
    addDocument,
    getDocument,
    getAllDocuments,
    addMessage,
    getMessages
  };
}
