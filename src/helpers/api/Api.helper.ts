import { ErrorRequestHandler, NextFunction, RequestHandler, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function createApiResponse<T>(statusCode = 200, message = "Success", data: T) {
  return {
    success: true,
    statusCode,
    message,
    error: null,
    data
  };
}
export function createPaginatedResponse<T>(
  statusCode = 200,
  message = "Success",
  itemsKey: string,
  items: T[],
  total: number,
  page: number,
  limit: number,
  sortField?: string,
  sortOrder?: "asc" | "desc"
) {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    statusCode,
    message,
    error: null,
    data: {
      [itemsKey]: items,
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      sort: {
        field: sortField,
        order: sortOrder
      }
    }
  };
}

// Factory function for error API responses
export function createApiErrorResponse<T>(
  statusCode = 500,
  message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  error: T,
  stack: string | null = null
) {
  const errorResponse = {
    success: false,
    statusCode,
    message,
    data: null,
    error
  };

  if (stack) {
    (errorResponse as any).stack = stack;
  } else {
    Error.captureStackTrace(errorResponse, createApiErrorResponse);
  }

  return errorResponse;
}

// Function for async request handlers
export function createAsyncHandler(
  handler: AsyncRequestHandler
): RequestHandler | ErrorRequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
