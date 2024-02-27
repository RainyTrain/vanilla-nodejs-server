import http from "http";

export type Request = http.IncomingMessage & {
  body?: any;
  params?: {
    [T: string]: any;
  };
  path?: string;
};

export type Response = http.OutgoingMessage;

export interface UserDto {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

export interface EditUserDto {
  name?: string;
  age?: number;
  hobbies?: string[];
}
