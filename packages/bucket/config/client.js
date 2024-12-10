"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
// export const s3Client = new S3Client({
//   region: process.env.AWS_S3_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_S3_SECRECT_ACCESS_KEY!,
//   },
// });
exports.s3Client = new client_s3_1.S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIARUUG23KGJUWHDNWV",
        secretAccessKey: "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",
    },
});
