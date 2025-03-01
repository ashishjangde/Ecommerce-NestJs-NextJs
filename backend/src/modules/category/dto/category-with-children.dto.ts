import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CategoryWithChildrenDto extends CategoryDto {
  @ApiPropertyOptional({ 
    description: 'Parent category', 
    type: () => CategoryDto 
  })
  parent?: CategoryDto;

  @ApiPropertyOptional({ 
    description: 'Sub-categories', 
    type: [CategoryDto] 
  })
  subCategories?: CategoryDto[];
}
