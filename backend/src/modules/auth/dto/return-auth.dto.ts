import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Roles } from '@prisma/client';

@Exclude()
export class ReturnAuthDto {
  @ApiProperty({
    type: 'string',
    example: '60f4b3b3b3b3b3b3b3b3b3b3',
    description: 'User ID',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Expose()
  email: string;

  @ApiProperty({ 
    enum: Roles,
    isArray: true,
    example: [Roles],
    description: 'User roles' 
  })
  @Expose()
  roles: Roles[];

  @ApiProperty({ example: false, description: 'Email verification status' })
  @Expose()
  verified: boolean;

  @ApiProperty({ example: new Date(), description: 'Creation timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'Last update timestamp' })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ReturnAuthDto>) {
    Object.assign(this, partial);
  }
}
