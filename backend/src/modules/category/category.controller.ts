import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryDto,
  CategoryWithChildrenDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as APIResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import ApiResponseClass from '../../common/responses/ApiResponse';
import {
  ApiCustomResponse,
  createErrorResponse,
} from '../../common/responses/ApiResponse';

@ApiTags('Categories')
@Controller('category')
@ApiCookieAuth()
@ApiExtraModels(CategoryDto, CategoryWithChildrenDto)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @APIResponse({
    status: 200,
    description: 'Returns all categories',
    schema: ApiCustomResponse({ categories: [CategoryDto] }),
  })
  async getAllCategories(@Res() res: Response) {
    const categories = await this.categoryService.getAllCategories();
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass(categories)
  );
  }

  @Get('root')
  @ApiOperation({ summary: 'Get root categories (with no parent)' })
  @APIResponse({
    status: 200,
    description: 'Returns root categories',
    schema: ApiCustomResponse({ categories: [CategoryDto] }),
  })
  async getRootCategories(@Res() res: Response) {
    const categories = await this.categoryService.getRootCategories();
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass({
        categories,
      }),
    );
  }

  @Get(':categoryId/children')
  @ApiOperation({ summary: 'Get subcategories of a specific category' })
  @APIResponse({
    status: 200,
    description: 'Returns subcategories',
    schema: ApiCustomResponse({ subcategories: [CategoryDto] }),
  })
  @APIResponse({
    status: 404,
    description: 'Category not found',
    schema: createErrorResponse(404, 'Category not found'),
  })
  async getSubCategories(
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    const subcategories =
      await this.categoryService.getSubCategories(categoryId);
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass({
        subcategories,
      }),
    );
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @APIResponse({
    status: 200,
    description: 'Returns the category',
    schema: ApiCustomResponse(CategoryWithChildrenDto),
  })
  @APIResponse({
    status: 404,
    description: 'Category not found',
    schema: createErrorResponse(404, 'Category not found'),
  })
  async getCategoryBySlug(@Param('slug') slug: string, @Res() res: Response) {
    const category = await this.categoryService.getCategoryBySlug(slug);
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass({
        category,
      }),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  @APIResponse({
    status: 201,
    description: 'Category created successfully',
    schema: ApiCustomResponse(CategoryDto),
  })
  @APIResponse({
    status: 400,
    description: 'Invalid data or slug already exists',
    schema: createErrorResponse(400, 'Invalid data or slug already exists'),
  })
  @APIResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
    schema: createErrorResponse(403, 'Forbidden'),
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    return res.status(HttpStatus.CREATED).json(
      new ApiResponseClass(
        category,
      ),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (admin only)' })
  @APIResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: ApiCustomResponse(CategoryDto),
  })
  @APIResponse({
    status: 404,
    description: 'Category not found',
    schema: createErrorResponse(404, 'Category not found'),
  })
  @APIResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
    schema: createErrorResponse(403, 'Forbidden'),
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass({
        message: 'Category updated successfully',
        category,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (admin only)' })
  @APIResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: ApiCustomResponse({ message: 'Category deleted successfully' }),
  })
  @APIResponse({
    status: 404,
    description: 'Category not found',
    schema: createErrorResponse(404, 'Category not found'),
  })
  @APIResponse({
    status: 403,
    description: 'Forbidden - requires admin role',
    schema: createErrorResponse(403, 'Forbidden'),
  })
  @APIResponse({
    status: 400,
    description: 'Cannot delete category with subcategories',
    schema: createErrorResponse(
      400,
      'Cannot delete category with subcategories',
    ),
  })
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    await this.categoryService.deleteCategory(id);
    return res.status(HttpStatus.OK).json(
      new ApiResponseClass({
        message: 'Category deleted successfully',
      }),
    );
  }
}
