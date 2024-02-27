import { Request, Response } from "../types/types";

export const urlParser =
  (base: string) =>
  (req: Request, res: Response): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!req.url) {
        reject(new Error("Error in url parser"));
      }

      req.params = {};

      const newPath = new URL(req.url!, base);

      req.path = newPath.pathname;

      const splitedPath = req.url!.split("/");
      const regex = /^\d+$/;

      if (splitedPath.length === 4 && regex.test(splitedPath[3])) {
        req.params.id = splitedPath[3];
        req.path = splitedPath.slice(0, 3).join("/") + "/:id";
      }

      const params: Record<string, string> = {};

      newPath.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      req.params = { ...req.params, ...params };

      resolve();
    });
  };
