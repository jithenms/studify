"use server";

import { s3 } from "@/aws/s3";
import { db } from "@/db/drizzle";
import { documents } from "@/db/schema";
import { generateEmbedding, analyzeNote, answerQuestion } from "@/openai/chat";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import pdf from "pdf-parse";

export async function getDocuments(user_id: number) {
  return await db
    .select()
    .from(documents)
    .where(eq(documents.user_id, user_id))
    .orderBy(desc(documents.created_at));
}

export async function uploadImage(formData: FormData, user_id: number) {
  const file = formData.get("file") as File;
  const body = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: `${user_id}/${file.name}`,
      Body: body,
      ContentType: file.type,
    })
  );

  let text = "";
  if (file.type.startsWith("image/")) {
    text = await analyzeNote(
      `${process.env.CLOUDFLARE_URL}/${user_id}/${file.name}`
    );
  } else if (file.type.startsWith("application/pdf")) {
    text = (await pdf(body)).text;
  }

  const embedding = await generateEmbedding(text!);

  await db.insert(documents).values({
    user_id: user_id,
    title: file.name,
    url: `${process.env.CLOUDFLARE_URL}/${user_id}/${file.name}`,
    content: text,
    embedding: embedding,
    size: file.size,
  });

  revalidatePath("/documents");
}

export async function generateResponse(query: string, user_id: number) {
  const embedding = await generateEmbedding(query);

  const similarity = sql<number>`1 - (${cosineDistance(
    documents.embedding,
    embedding
  )})`;

  const similarDocuments = await db
    .select({
      name: documents.title,
      url: documents.url,
      content: documents.content,
      similarity,
    })
    .from(documents)
    .where(and(gt(similarity, 0.3), eq(documents.user_id, user_id)))
    .orderBy((t) => desc(t.similarity))
    .limit(3);

  const context = similarDocuments
    .map(
      (document) =>
        `Title: ${document.name}\Url: ${document.url}\nContent: ${document.content}`
    )
    .join("\n\n");

  const response = await answerQuestion(query, context);

  return {
    message: response,
    documents: similarDocuments,
  };
}
