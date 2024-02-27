import { App } from "./src/app/app";
import { Router } from "./src/app/router";
import { UserController } from "./src/entities/user/userController";
import { bodyParser } from "./src/helpers/parsers/bodyParser";
import { urlParser } from "./src/helpers/parsers/urlParser";

const server = new App();
const router = new Router();
const userController = new UserController();

server.use(bodyParser);
server.use(urlParser(`${process.env.BASE}${process.env.PORT}`));

userController.createUser();
userController.deleteUserById();
userController.getAllUsers();
userController.getUserById();
userController.updateUserById();

server.addRoruter(router);
server.addRoruter(userController.userRouter);

server.listenServer();
