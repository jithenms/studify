"use server";

import { db } from "@/db/drizzle";
import { documents } from "@/db/schema";
import { s3 } from "@/lib/s3";
import { generateEmbedding, analyzeNote } from "@/lib/chat";
import { formatDocument } from "@/utils";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, desc, eq } from "drizzle-orm";
import pdf from "pdf-parse";

export async function getDocuments(userId: number) {
  const documentRecords = await db
    .select()
    .from(documents)
    .where(eq(documents.user_id, userId))
    .orderBy(desc(documents.created_at));
  return documentRecords.map((doc) => formatDocument(doc));
}

export async function uploadDocument(formData: FormData, userId: number) {
  const file = formData.get("file") as File;
  const body = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${userId}/${file.name}`,
      Body: body,
      ContentType: file.type,
    })
  );

  let text = "";
  if (file.type.startsWith("image/")) {
    text = await analyzeNote(userId, file.name);
  } else if (file.type.startsWith("application/pdf")) {
    text = (await pdf(body)).text;
  }

  const embedding = await generateEmbedding(text!);

  const documentRecords = await db
    .insert(documents)
    .values({
      user_id: userId,
      title: file.name,
      content: text,
      embedding: embedding,
      size: file.size,
    })
    .returning();
  return formatDocument(documentRecords[0]);
}

export async function deleteDocument(
  id: number,
  userId: number,
  fileName: string
) {
  await db
    .delete(documents)
    .where(and(eq(documents.id, id), eq(documents.user_id, userId)));

  const s3Key = `${userId}/${fileName}`;
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    })
  );
}

export const getPresignedUrl = async (userId: number, fileName: string) => {
  const bucketName = process.env.S3_BUCKET;
  const key = `${userId}/${fileName}`;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 60 });
};
