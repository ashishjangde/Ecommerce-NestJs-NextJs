import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailAuthDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
