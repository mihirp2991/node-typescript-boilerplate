import { Request, Response } from "express";
import StatusCodes, { getReasonPhrase } from "http-status-codes";
import HTTP from "node:http";
import { AddressInfo } from "node:net";
// import { ApiErrorResponseHelper, ApiResponseHelper, Log } from "@/helpers";
import { Config, ConfigKey } from "../../config";
import { Log } from "..";
import { createApiResponse } from "../api/Api.helper";

const serverErrorListening = async (error: NodeJS.ErrnoException): Promise<void> => {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      Log.logInfo("Requires privileges");
      return process.exit(1);

    case "EADDRINUSE":
      Log.logError(`${Config.getConfig<number>(ConfigKey.NODE_PORT)} is already in use`);
      return process.exit(1);

    default:
      throw error;
  }
};

const serverListening = async (server: HTTP.Server): Promise<void> => {
  const address: AddressInfo = <AddressInfo>server.address();
  Log.logInfo(`Express engine is running on ${address.port} 🚀`);
};

const processEventsListening = (server: HTTP.Server): void => {
  process
    .on("SIGINT", () => {
      try {
        server.close();
      } catch (SIGINTError: unknown) {
        if (SIGINTError instanceof Error) {
          Log.logError(`Error occurred during shutdown server`, SIGINTError);
        }
      } finally {
        Log.logInfo(`Express engine shutdown successfully 🌱`);
        process.exit(1);
      }
    })
    .on("SIGHUP", () => {
      process.kill(process.pid, "SIGTERM");
    })
    .on("uncaughtException", (UncaughtError: Error) => {
      Log.logError(`Uncaught Exception thrown`, UncaughtError);
      server.close();
      process.exit(1);
    })
    .on("unhandledRejection", (UncaughtReason: Error) => {
      Log.logError(`Unhandled Rejection thrown`, UncaughtReason);
      server.close();
      process.exit(1);
    });
};

const useAppHealthRoute = (req: Request, res: Response): Response => {
  Log.logInfo(Config.getConfig<string>(ConfigKey.NODE_ENV));
  const { platform, pid } = process;
  return res.status(StatusCodes.OK).json(
    createApiResponse<Record<string, unknown>>(
      StatusCodes.OK,
      "Welcome to backend! Made in Node with ❤️",
      {
        mode: Config.getConfig<string>(ConfigKey.NODE_ENV),
        platform: platform,
        pid: pid
      }
    )
  );
};

const useAppNotFoundRoute = (): void => {
  throw createApiResponse<string>(
    StatusCodes.NOT_FOUND,
    "Request resource not found",
    getReasonPhrase(StatusCodes.NOT_FOUND)
  );
};

export const AppHelper = {
  serverErrorListening,
  serverListening,
  processEventsListening,
  useAppHealthRoute,
  useAppNotFoundRoute
};
