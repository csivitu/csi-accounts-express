import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import constants from "./constants";
import { year, Options } from "./types";
import { scope, User } from "csi-accounts-express";

const yearMap = {
  1: '19',
  2: '18',
  3: '17',
  4: '16'
};

const verifyScopes = (userScopes: scope[], permitted: scope[]) => {
  for (const scope of permitted) {
    if (userScopes.indexOf(scope) == -1) {
      return false;
    }
  }
  return true;
}

const verifyYear = (regNo: string, permitted: year[]) => {
  const userNum = regNo.slice(0,2);

  for (const year of permitted) {
    if (userNum === yearMap[year]) {
      return true;
    }
  }
  return false;
}

const authorize = (options: Options) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers['x-access-token'] || req.headers.authorization) as string;

    if (!token) {
      res.status(401).json({
        success: false,
        message: constants.invalidToken,
      });
      return;
    }

    try {
      req.user = jwt.verify(token, options.secret) as User;
      if (options.scope !== undefined) {
        if (!verifyScopes(req.user.scope, options.scope)) {
          return res.status(403).json({
            success: false,
            message: constants.insufficientPrivileges,
          });  
        }
      }

      if (options.years !== undefined) {
        if (!verifyYear(req.user.regNo, options.years)) {
          return res.status(403).json({
            success: false,
            message: constants.insufficientPrivileges,
          });
        }
      }

      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: constants.invalidToken,
      });
    }
  }
}

export default authorize;