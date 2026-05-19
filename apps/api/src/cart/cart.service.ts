import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CartService {
  private readonly CART_KEY_PREFIX = 'cart:';
  private readonly CART_TTL = 60 * 60 * 24 * 7; // 7 days

  constructor(private readonly redisService: RedisService) {}

  private getCartKey(sessionId: string): string {
    return `${this.CART_KEY_PREFIX}${sessionId}`;
  }

  async getCart(sessionId: string): Promise<any[]> {
    const data = await this.redisService.get(this.getCartKey(sessionId));
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveCart(sessionId: string, items: any[]): Promise<void> {
    await this.redisService.set(
      this.getCartKey(sessionId),
      JSON.stringify(items),
      this.CART_TTL
    );
  }

  async clearCart(sessionId: string): Promise<void> {
    await this.redisService.del(this.getCartKey(sessionId));
  }
}
