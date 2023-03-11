import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Set desired value here
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const base64 = req.body as string;
  const filename = req.query.name as string;

  const imageBuffer = Buffer.from(base64, "base64");

  fs.writeFile(`src/uploads/${filename}`, imageBuffer, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).json({ filename: `src/uploads/${filename}` });
    }
  });
}