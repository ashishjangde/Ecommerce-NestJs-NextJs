import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import ApiResponse from '../responses/ApiResponse';
import ApiError from '../responses/ApiError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      const apiError = new ApiError(
        status,
        exceptionResponse.message,
        exceptionResponse.errors || [],
      );

      const apiResponse = new ApiResponse(null, apiError);
      response.status(status).json(apiResponse);
    } else {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal Server Error';
      let errors: string[] = [];

      if (exception instanceof Error) {
        errors = [exception.message];
      } else {
        errors = ['An unexpected error occurred'];
      }

      const apiError = new ApiError(status, message, errors);

      return response.status(status).json(new ApiResponse(null, apiError));
    }
  }
}
