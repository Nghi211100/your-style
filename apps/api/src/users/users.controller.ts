import { Controller, Get, Patch, Body, Param, Query, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('has-admin')
  async hasAdmin() {
    return this.usersService.hasAdmin();
  }

  @Post('create-first-admin')
  async createFirstAdmin(@Body() body: { email: string; name: string }) {
    return this.usersService.createFirstAdmin(body);
  }

  @Get('email')
  async findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('register')
  async register(@Body() body: { email: string; name: string }) {
    return this.usersService.create(body);
  }

  @Post('login')
  async login(@Body() body: { email: string }) {
    return this.usersService.findByEmail(body.email);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: { name?: string; email?: string; role?: any }) {
    return this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
