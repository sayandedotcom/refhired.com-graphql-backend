import dotenv from "dotenv";

dotenv.config();
console.log("region: process.env.process.env.BACKEND_PORT,", process.env.BACKEND_PORT);

async function init() {
  console.log("URLLL", await getObjectUrl("image/logo.png"));
}

init();
