import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(sessionId: string): Promise<any[]>;
    saveCart(sessionId: string, items: any[]): Promise<{
        success: boolean;
    }>;
    clearCart(sessionId: string): Promise<{
        success: boolean;
    }>;
}
