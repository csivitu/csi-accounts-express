/// <reference types="csi-accounts-express" />
import { Request, Response, NextFunction } from 'express';
import { Options } from './types';
declare const authorize: (options: Options) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => Response | undefined;
export default authorize;
