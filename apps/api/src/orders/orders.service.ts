import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { email, name, items, total } = createOrderDto;

    // Find or create user (either dummy guest or actual customer if email provided)
    const userEmail = email || 'guest@yourstyle.com';
    const userName = name || 'Guest Customer';

    let user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          role: 'CUSTOMER',
        },
      });
    }

    // Create the order and items in a transaction
    return this.prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
