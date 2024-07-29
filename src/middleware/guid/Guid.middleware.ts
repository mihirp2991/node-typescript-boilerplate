import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const guidMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.headers["x-request-id"] = uuidv4();
  next();
};
