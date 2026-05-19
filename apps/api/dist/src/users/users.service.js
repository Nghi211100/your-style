"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        let user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user && email === 'admin@maison.com') {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name: 'Maison Admin',
                    role: 'ADMIN',
                },
            });
        }
        if (!user && email === 'sarah.mitchell@example.com') {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name: 'Sarah Mitchell',
                    role: 'CUSTOMER',
                },
            });
            await this.seedSarahOrders(user.id);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async hasAdmin() {
        const adminCount = await this.prisma.user.count({
            where: { role: 'ADMIN' },
        });
        return { hasAdmin: adminCount > 0 };
    }
    async createFirstAdmin(data) {
        const adminCount = await this.prisma.user.count({
            where: { role: 'ADMIN' },
        });
        if (adminCount > 0) {
            throw new Error('An administrator account has already been initialized in the system.');
        }
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: 'ADMIN',
            },
        });
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: 'CUSTOMER',
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: {
                orders: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, updateDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateDto,
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async seedSarahOrders(userId) {
        const products = await this.prisma.product.findMany({ take: 4 });
        if (products.length < 2)
            return;
        await this.prisma.order.create({
            data: {
                userId,
                status: 'DELIVERED',
                total: products[0].price * 2 + products[1].price,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                items: {
                    create: [
                        {
                            productId: products[0].id,
                            quantity: 2,
                            price: products[0].price,
                            size: products[0].sizes[0] || 'M',
                            color: products[0].colors[0] || 'Black',
                        },
                        {
                            productId: products[1].id,
                            quantity: 1,
                            price: products[1].price,
                            size: products[1].sizes[1] || 'S',
                            color: products[1].colors[1] || 'Cream',
                        }
                    ]
                }
            }
        });
        if (products[2]) {
            await this.prisma.order.create({
                data: {
                    userId,
                    status: 'PENDING',
                    total: products[2].price,
                    createdAt: new Date(),
                    items: {
                        create: [
                            {
                                productId: products[2].id,
                                quantity: 1,
                                price: products[2].price,
                                size: products[2].sizes[0] || 'M',
                                color: products[2].colors[0] || 'Grey',
                            }
                        ]
                    }
                }
            });
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map