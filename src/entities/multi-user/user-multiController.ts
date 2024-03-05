import { Router } from "../../app/router";
import { Request, Response, UserDto } from "../../helpers/types/types";
import { MultiUserService } from "./user-multiService";

export class MultiUserController {
  userService: MultiUserService;
  userRouter: Router;

  constructor() {
    this.userService = new MultiUserService();
    this.userRouter = new Router();
  }

  getAllUsers() {
    this.userRouter.get("/users", (req: Request, res: Response) => {
      const users = this.userService.getAllUsers();

      res.write(JSON.stringify(users));
      res.end();
    });
  }

  createUser() {
    this.userRouter.post("/users", (req: Request, res: Response) => {
      const user = req.body as UserDto;
      const newUser = this.userService.createUser(user as UserDto);

      res.write(JSON.stringify(newUser));
      res.end();
    });
  }

  deleteUserById() {
    this.userRouter.delete("/users", (req: Request, res: Response) => {
      const user = this.userService.deleteUsers();

      res.write(JSON.stringify(user));
      res.end();
    });
  }
}
