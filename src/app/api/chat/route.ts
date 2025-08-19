import { db } from "@/db/drizzle";
import { documents } from "@/db/schema";
import { auth0 } from "@/lib/auth0";
import { answerQuestion, generateEmbedding } from "@/lib/chat";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { query, userId, history } = body;

  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const embedding = await generateEmbedding(query);

  const similarity = sql<number>`1 - (${cosineDistance(
    documents.embedding,
    embedding
  )})`;

  const similarDocuments = await db
    .select({
      title: documents.title,
      content: documents.content,
      similarity: sql<number>`1 - (${cosineDistance(
        documents.embedding,
        embedding
      )})`,
    })
    .from(documents)
    .where(and(gt(similarity, 0.3), eq(documents.user_id, userId)))
    .orderBy((t) => desc(t.similarity))
    .limit(3);

  const documentMessages = similarDocuments.map((doc) => ({
    role: "AI",
    content: `Title: ${doc.title}\nContent: ${doc.content}`,
  }));

  const conversation = [...history, ...documentMessages];

  const response = await answerQuestion(query, conversation);

  return new Response(
    JSON.stringify({
      message: response,
      documents: similarDocuments,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
