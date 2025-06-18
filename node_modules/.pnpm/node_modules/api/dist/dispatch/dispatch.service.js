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
exports.DispatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/database/prisma.service");
let DispatchService = class DispatchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWorkOrder(data) {
        return this.prisma.workOrder.create({
            data: {
                ...data,
                woNumber: await this.generateWoNumber(),
            },
        });
    }
    async getWorkOrders(status) {
        const where = status ? { status } : {};
        return this.prisma.workOrder.findMany({
            where,
            include: {
                job: {
                    select: { title: true },
                },
                truckTrips: {
                    include: {
                        driver: {
                            select: { firstName: true, lastName: true },
                        },
                    },
                },
            },
            orderBy: [
                { priority: 'desc' },
                { scheduledAt: 'asc' },
            ],
        });
    }
    async startTruckTrip(workOrderId, driverId, data) {
        return this.prisma.truckTrip.create({
            data: {
                workOrderId,
                driverId,
                startTime: new Date(),
                ...data,
            },
        });
    }
    async completeTruckTrip(tripId, data) {
        const trip = await this.prisma.truckTrip.update({
            where: { id: tripId },
            data: {
                endTime: new Date(),
                ...data,
            },
        });
        await this.prisma.workOrder.update({
            where: { id: trip.workOrderId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
            },
        });
        return trip;
    }
    async generateWoNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const lastWo = await this.prisma.workOrder.findFirst({
            where: {
                woNumber: {
                    startsWith: `WO${year}${month}`,
                },
            },
            orderBy: { woNumber: 'desc' },
        });
        let sequence = 1;
        if (lastWo) {
            const lastSequence = parseInt(lastWo.woNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `WO${year}${month}${String(sequence).padStart(4, '0')}`;
    }
};
exports.DispatchService = DispatchService;
exports.DispatchService = DispatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DispatchService);
//# sourceMappingURL=dispatch.service.js.map