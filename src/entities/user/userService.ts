import fs from "fs";
import path from "path";

const db = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "..", "users.json"), {
    encoding: "utf-8",
  }),
);

const writeToFile = (data: string) => {
  return fs.writeFileSync(
    path.resolve(__dirname, "..", "..", "users.json"),
    data,
  );
};

interface UserDto {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

export class UserService {
  createUser(user: UserDto) {
    db.users.push(user);

    try {
      writeToFile(JSON.stringify(db));
    } catch {
      throw new Error("Error with writing to file");
    }
  }

  getAllUsers() {
    return db.users as UserDto[];
  }

  findUserById(id: string) {
    const user = db.users.find((user: UserDto) => user.id === id);

    return user as UserDto;
  }

  deleteUserById(id: string) {
    const user = db.users.find((user: UserDto) => user.id == id);

    const index = db.users.findIndex((user: UserDto) => user.id == id);

    db.users.splice(index, 1);

    try {
      writeToFile(JSON.stringify(db));
    } catch {
      throw new Error("Error with writing to file");
    }

    return user;
  }
}
