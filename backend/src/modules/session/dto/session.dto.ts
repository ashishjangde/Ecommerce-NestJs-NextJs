import { ApiProperty } from '@nestjs/swagger';

export class SessionDto {
  @ApiProperty({
    description: 'Unique identifier of the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who owns the session',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'Date when the session was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the session was last updated',
    example: '2023-01-01T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'IP address of the device',
    example: '192.168.1.1',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent information',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  userAgent?: string;

  @ApiProperty({
    description: 'Whether this is the current session of the user',
    example: true,
  })
  isCurrent: boolean;
}
