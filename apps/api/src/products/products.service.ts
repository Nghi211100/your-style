import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Basic implementation for now
    return this.prisma.product.create({
      data: createProductDto as any,
    });
  }

  async findAll(filters?: {
    search?: string;
    category?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.category && filters.category !== 'all') {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    if (filters?.size) {
      where.sizes = { has: filters.size };
    }

    if (filters?.color) {
      where.colors = { has: filters.color };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      if (filters.sortBy === 'price_asc') {
        orderBy = { price: 'asc' };
      } else if (filters.sortBy === 'price_desc') {
        orderBy = { price: 'desc' };
      } else if (filters.sortBy === 'newest') {
        orderBy = { createdAt: 'desc' };
      }
    }

    return this.prisma.product.findMany({
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }
  
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto as any,
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id }
    });
  }
}
