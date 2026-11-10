import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggingService } from "./graylog.common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: any;
  constructor() {
    this.logger = new LoggingService();
  }
  use(req: Request, res: Response, next: NextFunction) {
    // Capture response status code
    const statusCode = res.statusCode;

    // Set color based on status code
    if (statusCode >= 200 && statusCode < 300) {
      this.logger.log(
        `[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`,
      );
    } else if (statusCode >= 400 && statusCode < 500) {
      this.logger.warn(
        `[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`,
      );
    } else {
      this.logger.error(
        `[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`,
      );
    }

    next();
  }
}
