import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: any) {
    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  async findAll(category?: string, all?: boolean) {
    return this.prisma.post.findMany({
      where: {
        ...(!all ? { published: true } : {}),
        ...(category && category !== 'All' ? { category: { equals: category, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: any) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
