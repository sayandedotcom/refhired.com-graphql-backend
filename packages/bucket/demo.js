import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

console.log("region: process.env.AWS_S3_ACCESS_KEY_ID,", process.env.AWS_S3_ACCESS_KEY_ID);
console.log("region: process.env.AWS_S3_SECRECT_ACCESS_KEY,", process.env.AWS_S3_SECRECT_ACCESS_KEY);
console.log("region: process.env.AWS_S3_REGION,", process.env.AWS_S3_REGION);
console.log("region: process.env.AWS_SES_REGION,", process.env.AWS_SES_REGION);

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIARUUG23KGJUWHDNWV",
    secretAccessKey: "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",
  },
});

export async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: "refhired.com",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

// async function init() {
//   console.log("URLLL", await getObjectUrl("image/logo.png"));
// }

// init();
