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
exports.WpsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/database/prisma.service");
let WpsService = class WpsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.wpsSpec.findMany({
            where: { isActive: true },
            include: {
                pqrTests: true,
                welderCerts: {
                    include: {
                        welder: {
                            select: { firstName: true, lastName: true },
                        },
                    },
                },
            },
            orderBy: { code: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.wpsSpec.findUnique({
            where: { id },
            include: {
                pqrTests: true,
                welderCerts: {
                    include: {
                        welder: {
                            select: { firstName: true, lastName: true },
                        },
                    },
                },
            },
        });
    }
    async getExpiringCerts(days = 30) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        return this.prisma.welderCert.findMany({
            where: {
                expiresAt: {
                    lte: expiryDate,
                },
                isActive: true,
            },
            include: {
                welder: {
                    select: { firstName: true, lastName: true, email: true },
                },
                wps: {
                    select: { code: true, title: true },
                },
            },
            orderBy: { expiresAt: 'asc' },
        });
    }
};
exports.WpsService = WpsService;
exports.WpsService = WpsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WpsService);
//# sourceMappingURL=wps.service.js.map