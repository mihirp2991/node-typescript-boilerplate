import { date } from "../../utils";
import winston, { transports } from "winston";

export type Logger = winston.Logger;

const logger: Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" })
  ],
  format: winston.format.combine(
    winston.format.colorize({
      level: true,
      message: true,
      colors: {
        error: "red",
        info: "green",
        debug: "green",
        http: "blue"
      }
    }),
    winston.format.timestamp({
      format: date()
    }),
    winston.format.simple(),
    winston.format.printf((info: winston.Logform.TransformableInfo) => {
      const printMessage = `[${info.timestamp}] [${info.level}]: ${info.message}`;
      if (info.metadata) {
        if (info.metadata instanceof Error) {
          const { message, stack } = info.metadata;
          const errorMessage = JSON.stringify({ message, stack }, null, 2);
          return `${printMessage} | ${errorMessage}`;
        }
        if (typeof info.metadata === "object") {
          const message = JSON.stringify(info.metadata, null, 2);
          return `${printMessage} | ${message}`;
        }
        if (typeof info.metadata === "number") {
          return `${printMessage} | ${info.metadata}`;
        }
        return `${printMessage} | ${info.metadata}`;
      }
      return printMessage;
    })
  )
});

const logInfo = (message: string, metadata?: unknown): void => {
  logger.info(message, { metadata });
};

const logDebug = (message: string, metadata?: unknown): void => {
  logger.debug(message, { metadata });
};

const logError = (message: string, metadata?: unknown): void => {
  logger.error(message, { metadata });
};

const logHttp = (message: string): void => {
  logger.http(message);
};

export const LoggerHelper = { logInfo, logDebug, logError, logHttp };
