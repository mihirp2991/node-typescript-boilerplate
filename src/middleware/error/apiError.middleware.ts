import { Config } from "../../config";
import { Log } from "../../helpers";
import { createApiErrorResponse } from "../../helpers/api/Api.helper";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function apiErrorHelperMiddleware<T = string>(
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  const { message, name, stack } = err;
  let { statusCode, error } = err;
  if (!statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  const errors = createApiErrorResponse<NonNullable<T> | string>(
    statusCode,
    message,
    error ?? name,
    stack
  );

  if (Config.isDev()) {
    Log.logError("", errors);
  }

  const response = {
    ...errors,
    ...(Config.isDev() ? { stack } : {})
  };

  return res.status(statusCode).json(response);
}
