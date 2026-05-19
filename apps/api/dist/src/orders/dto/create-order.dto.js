"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
class CreateOrderItemDto {
    productId;
    quantity;
    price;
    size;
    color;
}
exports.CreateOrderItemDto = CreateOrderItemDto;
class CreateOrderDto {
    email;
    name;
    items;
    total;
}
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=create-order.dto.js.map