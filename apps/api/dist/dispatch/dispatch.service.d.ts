import { PrismaService } from '../common/database/prisma.service';
export declare class DispatchService {
    private prisma;
    constructor(prisma: PrismaService);
    createWorkOrder(data: any): Promise<any>;
    getWorkOrders(status?: string): Promise<any>;
    startTruckTrip(workOrderId: string, driverId: string, data: any): Promise<any>;
    completeTruckTrip(tripId: string, data: any): Promise<any>;
    private generateWoNumber;
}
