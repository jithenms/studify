import { S3Client } from "@aws-sdk/client-s3";

// pick up creds from environment
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
});