import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Auto-create default luxury admin if email is admin@maison.com
    if (!user && email === 'admin@maison.com') {
      user = await this.prisma.user.create({
        data: {
          email,
          name: 'Maison Admin',
          role: 'ADMIN',
        },
      });
    }

    // Auto-create default luxury customer if email is Sarah's on first query
    if (!user && email === 'sarah.mitchell@example.com') {
      user = await this.prisma.user.create({
        data: {
          email,
          name: 'Sarah Mitchell',
          role: 'CUSTOMER',
        },
      });
      
      // Seed some initial orders for Sarah so she has history on first load!
      await this.seedSarahOrders(user.id);
    }

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async hasAdmin() {
    const adminCount = await this.prisma.user.count({
      where: { role: 'ADMIN' },
    });
    return { hasAdmin: adminCount > 0 };
  }

  async createFirstAdmin(data: { email: string; name: string }) {
    const adminCount = await this.prisma.user.count({
      where: { role: 'ADMIN' },
    });
    if (adminCount > 0) {
      throw new Error('An administrator account has already been initialized in the system.');
    }
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'ADMIN',
      },
    });
  }

  async create(data: { email: string; name: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return existing;
    }
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'CUSTOMER',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        orders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: { name?: string; email?: string; role?: any }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  private async seedSarahOrders(userId: string) {
    const products = await this.prisma.product.findMany({ take: 4 });
    if (products.length < 2) return;

    // Create a delivered order
    await this.prisma.order.create({
      data: {
        userId,
        status: 'DELIVERED',
        total: products[0].price * 2 + products[1].price,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: products[0].price,
              size: products[0].sizes[0] || 'M',
              color: products[0].colors[0] || 'Black',
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: products[1].price,
              size: products[1].sizes[1] || 'S',
              color: products[1].colors[1] || 'Cream',
            }
          ]
        }
      }
    });

    // Create a processing order
    if (products[2]) {
      await this.prisma.order.create({
        data: {
          userId,
          status: 'PENDING',
          total: products[2].price,
          createdAt: new Date(),
          items: {
            create: [
              {
                productId: products[2].id,
                quantity: 1,
                price: products[2].price,
                size: products[2].sizes[0] || 'M',
                color: products[2].colors[0] || 'Grey',
              }
            ]
          }
        }
      });
    }
  }
}
