import { PrismaService } from '../common/database/prisma.service';
export declare class WpsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    getExpiringCerts(days?: number): Promise<any>;
}
