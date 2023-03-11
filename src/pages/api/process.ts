import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // `src/uploads/${req.query.name}`
  const process = spawn("python", ["main.py"], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  process.stdin.write("src/uploads/" + req.query.name);
  process.stdin.end();

  // Listen for output from the script
  process.stdout.on("data", (data: any) => {
    res.write(data);
    console.log(`Python script stdout: ${data}`);
  });

  process.stderr.on("data", (data: any) => {
    console.error(`Python script stderr: ${data}`);
  });

  // Delete the uploaded file once the script has finished running
  process.on("exit", (code: number) => {
    console.log(`Python script exited with code ${code}`);
    fs.unlinkSync("src/uploads/" + req.query.name);
    res.end();
  });
}
