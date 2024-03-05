import http from "http";
import cluster from "cluster";
import EventEmitter from "events";
import os from "os";
import { Request, Response } from "../helpers/types/types";

export class MultiApplication {
  workers: Array<ReturnType<typeof cluster.fork>>;
  emitter: EventEmitter;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  middleware: Array<(...args: any[]) => Promise<unknown>>;
  numCPUs: number;
  activeWorker: number = 0;

  constructor() {
    this.workers = [];
    this.server = this.createClusterServer();
    this.emitter = new EventEmitter();
    this.middleware = [];
    this.numCPUs = this.availableCores();
    this.spawnWorkers();
  }

  clusterRequest(req: Request, res: Response) {
    const options = {
      port: 4000 + this.activeWorker,
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      path: "/users",
    };

    return http.request(options, (response) => {
      let data = "";
      let responseBody: unknown;

      response.setEncoding("utf8");

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (data) {
          responseBody = JSON.parse(data);
          res.write(JSON.stringify(responseBody));
        }

        this.activeWorker = (this.activeWorker + 1) % this.numCPUs;

        if (this.activeWorker === 0) {
          this.activeWorker = 1;
        }

        res.end("Success");
      });
    });
  }

  createClusterServer() {
    return http.createServer((req: Request, res: Response) => {
      let body = "";

      const request = this.clusterRequest(req, res);

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        if (body) {
          req.body = JSON.parse(body);
          request.end(JSON.stringify(req.body));
        } else {
          request.end();
        }
      });
    });
  }

  availableCores() {
    return os.availableParallelism();
  }

  spawnWorkers() {
    for (let index = 1; index < this.numCPUs; index++) {
      const worker = cluster.fork();
      this.workers.push(worker);
    }
    this.activeWorker = this.workers[0].id;
  }

  listenclusterServer(port: number | string) {
    this.server.listen(port, () => {
      console.log("Cluster server is alive on port", port);
    });
  }
}
