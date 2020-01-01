import { scope } from "csi-accounts-express";

export type year = 1 | 2 | 3 | 4;

export interface Options {
  secret: string;
  scope?: scope[];
  years?: year[];
}