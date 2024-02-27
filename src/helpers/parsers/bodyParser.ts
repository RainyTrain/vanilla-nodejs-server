import { Request, Response } from "../types/types";

export const bodyParser = (req: Request, res: Response): Promise<void> => {
  return new Promise((resolve, reject) => {
    let total = "";

    req.on("error", (err) => {
      reject(new Error("Error in bodyparser"));
    });

    req.on("data", (chunk: string) => {
      total += chunk;
    });

    req.on("end", () => {
      if (total) {
        req.body = JSON.parse(total);
      }
      resolve();
    });
  });
};
