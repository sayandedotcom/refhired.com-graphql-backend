import { Redis } from "ioredis";

const secrect = process.env.CACHE_DATABASE_URL?.toString();
// const redis = new Redis(`${process.env.CACHE_DATABASE_URL}`);
const redis = new Redis(
  "rediss://default:AcmrAAIncDFiMmQ1YTQ3YjZhMGU0OGQ1OTM1NDJiYWQ3MjI1MDJmZHAxNTE2Mjc@great-whippet-51627.upstash.io:6379"
);

redis.on("error", (error) => {
  console.log("process.env.CACHE_DATABASE_URL", process.env.CACHE_DATABASE_URL);
  console.error("Redis error:", error);
});

export default redis;
