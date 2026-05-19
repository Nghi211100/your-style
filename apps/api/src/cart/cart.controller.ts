import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':sessionId')
  async getCart(@Param('sessionId') sessionId: string) {
    return this.cartService.getCart(sessionId);
  }

  @Post(':sessionId')
  async saveCart(
    @Param('sessionId') sessionId: string,
    @Body() items: any[]
  ) {
    await this.cartService.saveCart(sessionId, items);
    return { success: true };
  }

  @Delete(':sessionId')
  async clearCart(@Param('sessionId') sessionId: string) {
    await this.cartService.clearCart(sessionId);
    return { success: true };
  }
}
