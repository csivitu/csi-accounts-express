export type scope = "csi" | "user";
export type year = 1 | 2 | 3 | 4;

export interface Options {
  secret: string;
  scope?: scope[];
  years?: year[];
}

// TODO: Would this type come from csi-db later?
export interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
  regNo: string;
  gender: string;
  scope: scope[];
}

declare module 'express' {
  interface Request {
    user: User;
  }
}