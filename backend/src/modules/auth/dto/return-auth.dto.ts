import { ApiProperty } from '@nestjs/swagger';

export class ReturnAuthDto {
  @ApiProperty({
    type: 'string',
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: false, description: 'Email verification status' })
  verified: boolean;

  @ApiProperty({ example: new Date(), description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Last update timestamp' })
  updatedAt: Date;
}
