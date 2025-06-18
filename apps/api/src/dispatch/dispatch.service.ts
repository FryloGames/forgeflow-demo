// apps/api/src/dispatch/dispatch.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class DispatchService {
  constructor(private prisma: PrismaService) {}

  async createWorkOrder(data: any) {
    return this.prisma.workOrder.create({
      data: {
        ...data,
        woNumber: await this.generateWoNumber(),
      },
    });
  }

  async getWorkOrders(status?: string) {
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

  async startTruckTrip(workOrderId: string, driverId: string, data: any) {
    return this.prisma.truckTrip.create({
      data: {
        workOrderId,
        driverId,
        startTime: new Date(),
        ...data,
      },
    });
  }

  async completeTruckTrip(tripId: string, data: any) {
    const trip = await this.prisma.truckTrip.update({
      where: { id: tripId },
      data: {
        endTime: new Date(),
        ...data,
      },
    });

    // Update work order status
    await this.prisma.workOrder.update({
      where: { id: trip.workOrderId },
      data: { 
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return trip;
  }

  private async generateWoNumber(): Promise<string> {
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
}