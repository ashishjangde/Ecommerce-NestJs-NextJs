import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import {
  CategoryRepository,
  CategoryWithRelations,
} from '../../repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDto } from './dto/category.dto';
import { CategoryWithChildrenDto } from './dto/category-with-children.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Transform database category to DTO
   */
  private mapCategoryToDto(category: any): CategoryDto {
    return {
      ...category,
    };
  }


  private mapCategoryWithRelationsToDto(
    category: CategoryWithRelations,
  ): CategoryWithChildrenDto {
    const mappedCategory = this.mapCategoryToDto(
      category,
    ) as CategoryWithChildrenDto;

    // Map parent if exists
    if (category.parent) {
      mappedCategory.parent = this.mapCategoryToDto(category.parent);
    }

    // Map subcategories if they exist
    if (category.subCategories && category.subCategories.length > 0) {
      mappedCategory.subCategories = category.subCategories.map(sub =>
        this.mapCategoryToDto(sub),
      );
    } else {
      mappedCategory.subCategories = [];
    }

    return mappedCategory;
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<CategoryDto[]> {
    try {
      const categories = await this.categoryRepository.findAll();
      return categories.map(category => this.mapCategoryToDto(category));
    } catch (error) {
      this.logger.error(
        `Error retrieving all categories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get root categories (with no parent)
   */
  async getRootCategories(): Promise<CategoryDto[]> {
    try {
      const rootCategories = await this.categoryRepository.findRootCategories();
      return rootCategories.map(category => this.mapCategoryToDto(category));
    } catch (error) {
      this.logger.error(
        `Error retrieving root categories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get subcategories of a specific category
   */
  async getSubCategories(categoryId: string): Promise<CategoryDto[]> {
    try {
      // First verify that the parent category exists
      const parentExists = await this.categoryRepository.findById(categoryId);
      if (!parentExists) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      const subCategories =
        await this.categoryRepository.findSubcategories(categoryId);
      return subCategories.map(category => this.mapCategoryToDto(category));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Error retrieving subcategories for category ID ${categoryId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get category by slug with its parent and children
   */
  async getCategoryBySlug(slug: string): Promise<CategoryWithChildrenDto> {
    try {
      const category =
        await this.categoryRepository.findBySlugWithRelations(slug);
      if (!category) {
        throw new NotFoundException(`Category with slug '${slug}' not found`);
      }

      return this.mapCategoryWithRelationsToDto(category);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Error retrieving category by slug ${slug}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      // Check if slug already exists
      const slugExists = await this.categoryRepository.slugExists(
        createCategoryDto.slug,
      );
      if (slugExists) {
        throw new ConflictException(
          `Category with slug '${createCategoryDto.slug}' already exists`,
        );
      }

      // If parentId is provided, verify that parent exists
      if (createCategoryDto.parentId) {
        const parentExists = await this.categoryRepository.findById(
          createCategoryDto.parentId,
        );
        if (!parentExists) {
          throw new NotFoundException(
            `Parent category with ID ${createCategoryDto.parentId} not found`,
          );
        }
      }

      const newCategory =
        await this.categoryRepository.create(createCategoryDto);
      return this.mapCategoryToDto(newCategory);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      )
        throw error;

      this.logger.error(
        `Error creating category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update a category
   */
  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      // Verify category exists
      const categoryExists = await this.categoryRepository.findById(id);
      if (!categoryExists) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // If slug is being changed, check if the new slug already exists
      if (
        updateCategoryDto.slug &&
        updateCategoryDto.slug !== categoryExists.name
      ) {
        const slugExists = await this.categoryRepository.slugExists(
          updateCategoryDto.slug,
          id,
        );
        if (slugExists) {
          throw new ConflictException(
            `Category with slug '${updateCategoryDto.slug}' already exists`,
          );
        }
      }

      // If parentId is provided, verify that parent exists and prevent circular references
      if (updateCategoryDto.parentId) {
        // Cannot set parent to itself
        if (updateCategoryDto.parentId === id) {
          throw new BadRequestException('Category cannot be its own parent');
        }

        const parentExists = await this.categoryRepository.findById(
          updateCategoryDto.parentId,
        );
        if (!parentExists) {
          throw new NotFoundException(
            `Parent category with ID ${updateCategoryDto.parentId} not found`,
          );
        }

        // Prevent circular references - check if new parent is not a descendant of this category
        let currentParentId = parentExists.parentId;
        while (currentParentId) {
          if (currentParentId === id) {
            throw new BadRequestException(
              'Cannot create circular category hierarchy',
            );
          }

          const ancestor =
            await this.categoryRepository.findById(currentParentId);
          currentParentId = ancestor?.parentId || null;
        }
      }

      const updatedCategory = await this.categoryRepository.update(
        id,
        updateCategoryDto,
      );
      return this.mapCategoryToDto(updatedCategory);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      )
        throw error;

      this.logger.error(
        `Error updating category with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      // Verify category exists
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Check if category has subcategories
      const subCategoriesCount =
        await this.categoryRepository.countSubcategories(id);
      if (subCategoriesCount > 0) {
        throw new BadRequestException(
          `Cannot delete category with ${subCategoriesCount} subcategories. Delete subcategories first.`,
        );
      }

      // Check if category is linked to products
      const productsCount = await this.categoryRepository.countProducts(id);
      if (productsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category with ${productsCount} linked products. Remove product associations first.`,
        );
      }

      await this.categoryRepository.delete(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      this.logger.error(
        `Error deleting category with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
