import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            price: number;
            size: string | null;
            color: string | null;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                slug: string;
                name: string;
                description: string;
                price: number;
                salePrice: number | null;
                stock: number;
                category: string;
                images: string[];
                colors: string[];
                sizes: string[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            price: number;
            size: string | null;
            color: string | null;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                name: string;
                description: string;
                price: number;
                salePrice: number | null;
                stock: number;
                category: string;
                images: string[];
                colors: string[];
                sizes: string[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            price: number;
            size: string | null;
            color: string | null;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
    })[]>;
    updateStatus(id: string, status: any): Promise<{
        user: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                name: string;
                description: string;
                price: number;
                salePrice: number | null;
                stock: number;
                category: string;
                images: string[];
                colors: string[];
                sizes: string[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            price: number;
            size: string | null;
            color: string | null;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
    }>;
}
