import { InferSelectModel } from "drizzle-orm";
import { documents } from "./db/schema";

export type DocumentType = {
  size: string;
  created_at: string;
  id: number;
  title: string;
  content: string | null;
  embedding: number[] | null;
  user_id: number;
};

export type ChatResponse = {
  message: string;
  documents: (InferSelectModel<typeof documents> & {
    similarity: number;
  })[];
};

export type Message = {
  role: "You" | "AI";
  content: string;
  resources?: {
    title: string;
    similarity: number;
  }[];
};
