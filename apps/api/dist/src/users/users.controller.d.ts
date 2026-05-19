import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    hasAdmin(): Promise<{
        hasAdmin: boolean;
    }>;
    createFirstAdmin(body: {
        email: string;
        name: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    register(body: {
        email: string;
        name: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: {
        email: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            total: number;
        }[];
    } & {
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(id: string, updateDto: {
        name?: string;
        email?: string;
        role?: any;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
