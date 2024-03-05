import http from "http";
import EventEmitter from "events";
import { Methods } from "./router";
import "dotenv/config";
import { Request, Response } from "../helpers/types/types";

export class App {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;
  middleware: Array<(...args: any[]) => Promise<unknown>>;

  constructor() {
    this.server = this.createServer();
    this.emitter = new EventEmitter();
    this.middleware = [];
  }

  addRoruter(router: any) {
    Object.keys(router.router).forEach((path: any) => {
      const route = router.router[path];
      Object.keys(route).forEach((method: string) => {
        const handler = route[method];
        this.emitter.on(
          this.getRouteMask(method as Methods, path),
          (req: Request, res: Response) => {
            handler(req, res);
          },
        );
      });
    });
  }

  private getRouteMask(method: Methods, path: string) {
    return `${method}:${path}`;
  }

  private createServer() {
    return http.createServer(async (req: Request, res: Response) => {
      await Promise.all(this.middleware.map((handler) => handler(req, res)));

      console.log(req.path, "path", req.body);
      const emmited = this.emitter.emit(
        this.getRouteMask(req.method?.toUpperCase() as Methods, req.path!),
        req,
        res,
      );

      if (!emmited) {
        res.write("Path does not exist");
        res.end();
      }
    });
  }

  use(handler: (...args: any[]) => Promise<void>) {
    this.middleware.push(handler);
  }

  listenServer(port?: number | string) {
    const serverPort = port ?? (process.env.PORT || 4000);

    return this.server.listen(serverPort, () => {
      console.log("I'm alive!", serverPort);
    });
  }
}
