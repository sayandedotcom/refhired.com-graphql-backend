import { S3Client } from "@aws-sdk/client-s3";

// export const s3Client = new S3Client({
//   region: process.env.AWS_S3_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_S3_SECRECT_ACCESS_KEY!,
//   },
// });

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIARUUG23KGJUWHDNWV",
    secretAccessKey: "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",
  },
});