import http from "http";
import cluster from "cluster";
import os from "os";
import fs from "fs";
import path from "path";
import { Request, Response } from "./src/helpers/types/types";
import { bodyParser } from "./src/helpers/parsers/bodyParser";

const db = JSON.parse(
  fs.readFileSync(path.resolve("users-multi.json"), {
    encoding: "utf-8",
  }),
);

const writeToFile = (data: string) => {
  return fs.writeFileSync(path.resolve("users-multi.json"), data);
};

const workers: Array<ReturnType<typeof cluster.fork>> = [];

const numCPUs = os.availableParallelism();

let activeWorker: number;

if (cluster.isPrimary) {
  for (let index = 1; index < numCPUs; index++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  activeWorker = workers[0].id;
  console.log(activeWorker);

  cluster.on("fork", (worker) => {
    console.log(`Worker ${worker.id} is ready`);
  });

  cluster.on("listening", (worker, adress) => {
    console.log(`Worker ${worker.id} by ${adress.port} ${adress.address}`);
  });

  cluster.on("message", (worker, message) => {
    console.log(`Worker ${worker.id} sent ${message}`);
  });

  const clusterServer = http.createServer(
    async (req: Request, res: Response) => {
      console.log("Now active worker is", activeWorker);
      await bodyParser(req, res);

      const request = http.request(
        {
          port: 4000 + activeWorker,
          method: req.method,
          headers: {
            "Content-Type": "application/json",
          },
        },
        (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            if (data) {
              req.body = JSON.parse(data);
            }

            activeWorker = (activeWorker + 1) % numCPUs;
            res.end("Success");
          });
        },
      );

      request.write(JSON.stringify(req.body));

      request.end();
    },
  );

  clusterServer.listen(4000, () => {
    console.log("cluster server is alive");
  });
} else {
  const server = http.createServer(async (req: Request, res: Response) => {
    await bodyParser(req, res);

    if (req.url === "/") {
      switch (req.method) {
        case "GET":
          res.write(JSON.stringify(db.users));
          break;
        case "POST":
          db.users.push(req.body);
          writeToFile(JSON.stringify(db));
          res.write(JSON.stringify(req.body));
          break;
        case "DELETE":
          db.users = [];
          writeToFile(JSON.stringify(db));
          res.write(JSON.stringify(db.users));
          break;
      }
    } else {
      res.end("Path does not exist");
    }
    res.end();
  });

  server.listen(4000 + cluster.worker!.id, () => {
    console.log("Alive worker server");
  });
}
