import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../../repositories/category.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
