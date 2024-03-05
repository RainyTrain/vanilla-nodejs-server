import fs from "fs";
import path from "path";
import { UserDto } from "../../helpers/types/types";

const db = JSON.parse(
  fs.readFileSync(path.resolve("users-multi.json"), {
    encoding: "utf-8",
  }),
);

const writeToFile = (data: string) => {
  return fs.writeFileSync(path.resolve("users-multi.json"), data);
};

export class MultiUserService {
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

  deleteUsers() {
    try {
      const newUsersArr = { users: [] };

      writeToFile(JSON.stringify(newUsersArr));

      return newUsersArr;
    } catch {
      throw new Error("Error with writing to file");
    }
  }
}
