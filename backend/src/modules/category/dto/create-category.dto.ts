import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { BaseCategoryDto } from './base-category.dto';

export class CreateCategoryDto extends BaseCategoryDto {
  @ApiProperty({ 
    description: 'URL friendly slug for the category', 
    example: 'electronics' 
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
    message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
  })
  slug: string;
}
