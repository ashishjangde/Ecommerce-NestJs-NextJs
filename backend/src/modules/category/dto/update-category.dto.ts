import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { BaseCategoryDto } from './base-category.dto';

export class UpdateCategoryDto extends BaseCategoryDto {
  @ApiPropertyOptional({
    description: 'URL friendly slug for the category',
    example: 'electronics-and-gadgets',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;
}
