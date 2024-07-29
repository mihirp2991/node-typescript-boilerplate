import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import HTTP from "node:http";
import { Config, ConfigKey } from "./config";
import { AppHelper, Log } from "./helpers";
import morgan from "morgan";
import routes from "./routes";
import cors from "cors";
import path from "node:path";
import { guidMiddleware } from "./middleware";
import { apiErrorHelperMiddleware } from "./middleware/error/apiError.middleware";

dotenv.config();

Config.loadConfig();

const app = express();
const HTTPServer = HTTP.createServer(app);

export const run = async () => {
  try {
    await startApp();
    AppHelper.processEventsListening(HTTPServer);
  } catch (error) {
    Log.logError((error as Error).message);
  }
};

const startApp = async () => {
  app.set("port", Config.getConfig<number>(ConfigKey.NODE_PORT));
  HTTPServer.listen(Config.getConfig<number>(ConfigKey.NODE_PORT));

  HTTPServer.on("error", AppHelper.serverErrorListening);
  HTTPServer.on("close", Log.logInfo);

  HTTPServer.on("listening", async () => {
    await AppHelper.serverListening(HTTPServer);
    initialize();
  });
};

async function initialize(): Promise<void> {
  await initializeMiddleware();
  // await setupRequestMiddleware();
  await initializeRoutes();
  await initializeGlobalMiddleware();
}

// async function setupRequestMiddleware(): Promise<void> {
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     req.entity ??= {};
//     next();
//   });
// }

async function initializeMiddleware(): Promise<void> {
  app.use(express.urlencoded({ limit: "6kb", extended: true }));
  app.use(express.json({ limit: "6kb" }));
  app.use(guidMiddleware);
  app.use(morgan("combined", { stream: { write: Log.logHttp } }));
  app.use("/public", express.static(path.resolve(path.join(__dirname), "src", "public")));
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "OPTIONS", "PATCH", "POST", "DELETE"]
    })
  );
  // app.use(helmet({ contentSecurityPolicy: false }));
  // app.use(cookies());
}

async function initializeRoutes(): Promise<void> {
  app.use("/health-check", AppHelper.useAppHealthRoute);
  app.use(routes);
}

async function initializeGlobalMiddleware(): Promise<void> {
  app.use(AppHelper.useAppNotFoundRoute);
  app.use(apiErrorHelperMiddleware);
}

export default app;
