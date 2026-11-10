import { Injectable, ConsoleLogger, OnModuleInit } from "@nestjs/common";
import { createLogger, format, transports } from "winston";
import * as fs from "fs";
import * as path from "path";
import stringify from "safe-stable-stringify";

const IS_DEVELOPMENT = true;

@Injectable()
export class LoggingService extends ConsoleLogger implements OnModuleInit {
  private readonly logDir = path.join(__dirname, "..", "..", "log");
  private readonly logger = createLogger({
    level: "debug", // Set your desired default log level
    format: format.combine(
      format.timestamp(),
      format.metadata({
        fillExcept: ["message", "level", "timestamp", "label", "stack"],
      }),
      ...(!IS_DEVELOPMENT
        ? [format.uncolorize(), format.json()]
        : [
            format.colorize({
              all: true,
              colors: {
                debug: "green",
                info: "blue",
                warning: "amber",
                error: "red",
              },
            }),
            format.printf(
              ({ timestamp, level, message, metadata, stack = "" }) => {
                const extraData = Object.keys(metadata).length
                  ? stringify(metadata, null, 1)
                  : "";
                return [`${timestamp} [${level}]: ${message}`, extraData, stack]
                  .filter(Boolean)
                  .join("\n");
              },
            ),
          ]),
    ),
    transports: [
      new transports.Console({
        level: "debug", // Set your desired log level for Console transport
      }),
      new transports.File({
        filename: path.join(__dirname, "..", "..", "log", "development.log"),
        level: "debug",
      }),
      new transports.File({
        filename: path.join(__dirname, "..", "..", "log", "dev_errors.log"),
        level: "error",
      }),
      // Add more transports as needed, e.g., file transport for production logs
    ],
  });

  constructor() {
    super();
  }

  onModuleInit() {
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message);
    super.warn(message, context);
  }

  log(message: any) {
    this.logger.info(message);
  }

  debug(message: any, context?: string) {
    this.logger.debug(message);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message);
    super.verbose(message, context);
  }
}
