import http from "http";
import { Router } from "../../app/router";
import {
  EditUserDto,
  Request,
  Response,
  UserDto,
} from "../../helpers/types/types";
import { UserService } from "./userService";

export class UserController {
  userService: UserService;
  userRouter: Router;

  constructor() {
    this.userService = new UserService();
    this.userRouter = new Router();
  }

  getAllUsers() {
    this.userRouter.get(
      "/api/users",
      (req: http.IncomingMessage, res: http.OutgoingMessage) => {
        const users = this.userService.getAllUsers();

        res.write(JSON.stringify(users));
        res.end();
      },
    );
  }

  createUser() {
    this.userRouter.post("/api/users", (req: Request, res: Response) => {
      const user = req.body as UserDto;
      const newUser = this.userService.createUser(user as UserDto);

      res.write(JSON.stringify(newUser));
      res.end();
    });
  }

  getUserById() {
    this.userRouter.get("/api/users/:id", (req: Request, res: Response) => {
      const { id } = req.params!;
      const user = this.userService.findUserById(id);

      res.write(JSON.stringify(user));
      res.end();
    });
  }

  deleteUserById() {
    this.userRouter.delete("/api/users/:id", (req: Request, res: Response) => {
      const { id } = req.params!;
      const user = this.userService.deleteUserById(String(id));

      res.write(JSON.stringify(user));
      res.end();
    });
  }

  updateUserById() {
    this.userRouter.post("/api/users/:id", (req: Request, res: Response) => {
      const { id } = req.params!;
      const userFields = req.body as EditUserDto;

      const newUser = this.userService.updateUser(id, userFields);

      res.write(JSON.stringify(newUser));
      res.end();
    });
  }
}
