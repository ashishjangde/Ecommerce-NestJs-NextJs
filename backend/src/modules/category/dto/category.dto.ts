import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'Category unique identifier' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Category slug' })
  slug: string;

  @ApiPropertyOptional({ description: 'Category description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Image URL for category' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Meta title for SEO' })
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description for SEO' })
  metaDescription?: string;

  @ApiProperty({ description: 'Category active status' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Parent category ID' })
  parentId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
