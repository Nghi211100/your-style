import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: any) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query('category') category?: string, @Query('all') all?: string) {
    return this.postsService.findAll(category, all === 'true');
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: any) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
