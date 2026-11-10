// src/response-helper/response-helper.service.ts

import { Injectable, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class ResponseHelperService {
  sendSuccessResponse(
    res: Response,
    message: string,
    data: any,
    statusCode: number = HttpStatus.OK,
    success: boolean = true,
  ): void {
    res.status(statusCode).json({
      success,
      message,
      data,
    });
  }

  sendErrorResponse(
    res: Response,
    message: any,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    success: boolean = false,
  ): void {
    res.status(statusCode).json({
      success,
      error: {
        message,
      },
    });
  }
}
