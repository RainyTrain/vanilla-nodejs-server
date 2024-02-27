import fs from "fs";
import path from "path";
import { EditUserDto, UserDto } from "../../helpers/types/types";

const db = JSON.parse(
  fs.readFileSync(path.resolve("users.json"), {
    encoding: "utf-8",
  }),
);

const writeToFile = (data: string) => {
  return fs.writeFileSync(path.resolve("users.json"), data);
};

export class UserService {
  createUser(user: UserDto) {
    db.users.push(user);

    try {
      writeToFile(JSON.stringify(db));

      return user;
    } catch {
      throw new Error("Error with writing to file");
    }
  }

  getAllUsers() {
    return db.users as UserDto[];
  }

  findUserById(id: string) {
    const user = db.users.find((user: UserDto) => user.id == id);

    return user as UserDto;
  }

  deleteUserById(id: string) {
    const user = db.users.find((user: UserDto) => user.id == id);

    const index = db.users.findIndex((user: UserDto) => user.id == id);

    db.users.splice(index, 1);

    try {
      writeToFile(JSON.stringify(db));

      return user as UserDto;
    } catch {
      throw new Error("Error with writing to file");
    }
  }

  updateUser(id: string, userFields: EditUserDto) {
    let user = db.users.find((user: UserDto) => user.id == id);
    const index = db.users.findIndex((user: UserDto) => user.id == id);

    user = { ...user, ...userFields };

    db.users.splice(index, 1, user);

    writeToFile(JSON.stringify(db));

    return user;
  }
}
