import ApiError from './ApiError';
import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const ApiCustomResponse = (model: Function | Record<string, any>) => {
  return {
    type: 'object',
    required: ['localDateTime', 'data'],
    properties: {
      localDateTime: {
        type: 'string',
        format: 'date-time',
      },
      data:
        typeof model === 'function'
          ? { $ref: getSchemaPath(model) }
          : {
              type: 'object',
              properties: Object.entries(model).reduce(
                (acc, [key, value]) => {
                  // Handle arrays (for cases like [CategoryDto])
                  if (Array.isArray(value) && value.length > 0) {
                    return {
                      ...acc,
                      [key]: {
                        type: 'array',
                        items: typeof value[0] === 'function' 
                          ? { $ref: getSchemaPath(value[0]) }
                          : { type: typeof value[0], example: value[0] }
                      }
                    };
                  }
                  // Handle regular DTOs and other values
                  return {
                    ...acc,
                    [key]: typeof value === 'function'
                      ? { $ref: getSchemaPath(value) }
                      : {
                          type: typeof value,
                          example: value,
                        },
                  };
                },
                {},
              ),
            },
      apiError: {
        type: 'null',
      },
    },
  };
};

export const createErrorResponse = (
  statusCode: number,
  defaultMessage: string,
) => ({
  type: 'object',
  properties: {
    localDateTime: {
      type: 'string',
      format: 'date-time',
    },
    data: {
      type: 'null',
    },
    apiError: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: statusCode,
        },
        message: {
          type: 'string',
          example: defaultMessage,
        },
        errors: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: { type: 'string' },
            },
            {
              type: 'array',
              items: { type: 'string' },
            },
          ],
          example: { field: 'error message' },
        },
      },
    },
  },
});

@ApiExtraModels()
class ApiResponse<T> {
  @ApiProperty({ example: new Date() })
  localDateTime: Date;

  @ApiProperty({
    required: true,
    nullable: true,
    description: 'Response data',
  })
  data: T | null;

  @ApiProperty({
    type: ApiError,
    nullable: true,
    required: false,
  })
  apiError?: ApiError | [] | null;

  constructor(data: T, apiError?: ApiError) {
    this.localDateTime = new Date();

    if (data) {
      this.data = data;
      this.apiError = undefined;
    } else {
      this.data = null;
      this.apiError = apiError || undefined;
    }
  }
}

export default ApiResponse;
