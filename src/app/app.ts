import http from "http";
import EventEmitter from "events";
import { Methods } from "./router";
import "dotenv/config";

export class App {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;

  constructor() {
    this.server = this.createServer();
    this.emitter = new EventEmitter();
  }

  addRoruter(router: any) {
    Object.keys(router.router).forEach((path: any) => {
      const route = router.router[path];
      Object.keys(route).forEach((method: string) => {
        const handler = route[method];
        this.emitter.on(
          this.getRouteMask(method as Methods, path),
          (req: http.IncomingMessage, res: http.OutgoingMessage) => {
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
    return http.createServer(
      (req: http.IncomingMessage, res: http.OutgoingMessage) => {
        const emmited = this.emitter.emit(
          this.getRouteMask(req.method?.toUpperCase() as Methods, req.url!),
          req,
          res,
        );

        if (!emmited) {
          res.write("Path does not exist");
          res.end();
        }
      },
    );
  }

  listenServer() {
    const port = process.env.PORT || 4000;

    return this.server.listen(port, () => {
      console.log("I'm alive!", port);
    });
  }
}
