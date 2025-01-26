import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  auth_id: text("auth_id").notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    content: text("content").default(""),
    size: integer("size").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);
