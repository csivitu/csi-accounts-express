type scope = "csi" | "user";
type year = 1 | 2 | 3 | 4;

interface Options {
  secret: string;
  scope?: scope[];
  years?: year[];
}

// TODO: Would this type come from csi-db later?
interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
  regNo: string;
  gender: string;
  scope: scope[];
}

declare namespace Express {
    interface Request {
      user: User;
    }
}
  