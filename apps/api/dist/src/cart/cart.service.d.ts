import { RedisService } from '../redis/redis.service';
export declare class CartService {
    private readonly redisService;
    private readonly CART_KEY_PREFIX;
    private readonly CART_TTL;
    constructor(redisService: RedisService);
    private getCartKey;
    getCart(sessionId: string): Promise<any[]>;
    saveCart(sessionId: string, items: any[]): Promise<void>;
    clearCart(sessionId: string): Promise<void>;
}
