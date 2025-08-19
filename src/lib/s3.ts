import { S3Client } from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ROLE_ARN && {
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN,
    }),
  }),
});
