import cluster from "cluster";
import { App } from "./src/app/app";
import { MultiApplication } from "./src/app/multi-app";
import "dotenv/config";
import { MultiUserController } from "./src/entities/multi-user/user-multiController";
import { bodyParser } from "./src/helpers/parsers/bodyParser";
import { urlParser } from "./src/helpers/parsers/urlParser";

const port = process.env.PORT || 8000;

if (cluster.isPrimary) {
  const clusterServer = new MultiApplication();

  clusterServer.listenclusterServer(port);
} else {
  const workerServer = new App();
  const multiUserController = new MultiUserController();

  workerServer.use(bodyParser);
  workerServer.use(urlParser(`${process.env.BASE}${process.env.PORT}`));

  multiUserController.createUser();
  multiUserController.deleteUserById();
  multiUserController.getAllUsers();

  workerServer.addRoruter(multiUserController.userRouter);

  workerServer.listenServer(Number(port) + cluster.worker!.id);
}
