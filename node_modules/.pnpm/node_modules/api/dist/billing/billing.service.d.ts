import { PrismaService } from '../common/database/prisma.service';
export declare class BillingService {
    private prisma;
    constructor(prisma: PrismaService);
    createInvoice(data: any): Promise<any>;
    private getTaxRates;
    private generateInvoiceNumber;
}
