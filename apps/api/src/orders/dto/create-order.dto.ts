export class CreateOrderItemDto {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export class CreateOrderDto {
  email?: string; // used to identify guest user
  name?: string;  // used to create guest user name
  items: CreateOrderItemDto[];
  total: number;
}
