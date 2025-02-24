import { ApiProperty } from '@nestjs/swagger';

class ApiError {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  errors?: Record<string, string> | string[];

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string> | string[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export default ApiError;
