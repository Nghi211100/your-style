export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
}
export declare class CreateOrderDto {
    email?: string;
    name?: string;
    items: CreateOrderItemDto[];
    total: number;
}
