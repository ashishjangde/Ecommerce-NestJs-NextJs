import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from '../modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '../modules/category/dto/update-category.dto';
import { handleDatabaseOperations } from 'src/common/utils/utils';

// Define a type for category with relations
export type CategoryWithRelations = Category & {
  parent?: Category | null;
  subCategories?: Category[];
};

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all categories
   */
  async findAll(): Promise<Category[]> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      })
    );
    return result || [];
  }

  /**
   * Find root categories (those without parents)
   */
  async findRootCategories(): Promise<Category[]> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.findMany({
        where: {
          parentId: null,
        },
        orderBy: {
          name: 'asc',
        },
      })
    );
    return result || [];
  }

  /**
   * Find subcategories of a specific category
   */
  async findSubcategories(parentId: string): Promise<Category[]> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.findMany({
        where: {
          parentId,
        },
        orderBy: {
          name: 'asc',
        },
      })
    );
    return result || [];
  }

  /**
   * Find a category by slug (stored in name field)
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return handleDatabaseOperations(() => 
      this.prisma.category.findFirst({
        where: {
          slug: slug,
        },
      })
    );
  }

  /**
   * Find category by ID with subcategories and parent
   */
  async findByIdWithRelations(id: string): Promise<CategoryWithRelations | null> {
    return handleDatabaseOperations(() => 
      this.prisma.category.findUnique({
        where: {
          id,
        },
        include: {
          subCategories: true,
          parent: true,
        },
      })
    );
  }

  /**
   * Find category by slug with subcategories and parent
   */
  async findBySlugWithRelations(slug: string): Promise<CategoryWithRelations | null> {
    return handleDatabaseOperations(() => 
      this.prisma.category.findFirst({
        where: {
          slug: slug,
        },
        include: {
          subCategories: true,
          parent: true,
        },
      })
    );
  }

  /**
   * Find a category by ID
   */
  async findById(id: string): Promise<Category | null> {
    return handleDatabaseOperations(() => 
      this.prisma.category.findUnique({
        where: {
          id,
        },
      })
    );
  }

  /**
   * Check if slug exists
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.count({
        where: {
          slug: slug,
          id: excludeId ? { not: excludeId } : undefined,
        },
      })
    );
    return result ? result > 0 : false;
  }

  /**
   * Create a new category
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.create({
        data
      })
    );
    
    if (!result) {
      throw new Error('Failed to create category');
    }
    
    return result;
  }

  /**
   * Update a category
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.update({
        where: {
          id,
        },
       data
      })
    );
    
    if (!result) {
      throw new Error(`Failed to update category with ID ${id}`);
    }
    
    return result;
  }

  /**
   * Delete a category
   */
  async delete(id: string): Promise<Category> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.delete({
        where: {
          id,
        },
      })
    );
    
    if (!result) {
      throw new Error(`Failed to delete category with ID ${id}`);
    }
    
    return result;
  }

  /**
   * Count subcategories of a category
   */
  async countSubcategories(parentId: string): Promise<number> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.category.count({
        where: {
          parentId,
        },
      })
    );
    return result || 0;
  }

  /**
   * Count products in a category
   */
  async countProducts(categoryId: string): Promise<number> {
    const result = await handleDatabaseOperations(() => 
      this.prisma.productCategory.count({
        where: {
          categoryId,
        },
      })
    );
    return result || 0;
  }
}
