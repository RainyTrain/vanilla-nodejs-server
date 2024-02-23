import http from "http";
import { App } from "./src/app/app";
import { Router } from "./src/app/router";

const server = new App();
const router = new Router();

router.get("/info", (req: http.IncomingMessage, res: http.OutgoingMessage) => {
  res.write("Info");
  res.end();
});

server.addRoruter(router);

server.listenServer();
