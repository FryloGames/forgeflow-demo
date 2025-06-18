// apps/api/src/billing/billing.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(data: any) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    // Calculate taxes based on customer province
    const taxRates = this.getTaxRates(customer.province);
    const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstHst = subtotal * taxRates.gstHst;
    const pst = subtotal * taxRates.pst;
    const total = subtotal + gstHst + pst;

    return this.prisma.invoice.create({
      data: {
        ...data,
        invoiceNumber: await this.generateInvoiceNumber(),
        subtotal,
        gstHst,
        pst,
        total,
        items: {
          create: data.items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  private getTaxRates(province: string): { gstHst: number; pst: number } {
    const rates = {
      'AB': { gstHst: 0.05, pst: 0 },
      'BC': { gstHst: 0.05, pst: 0.07 },
      'ON': { gstHst: 0.13, pst: 0 },
      'QC': { gstHst: 0.05, pst: 0.09975 },
      // Add other provinces...
    };
    
    return rates[province] || { gstHst: 0.05, pst: 0 };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV${year}`,
        },
      },
      orderBy: { invoiceNumber: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-5));
      sequence = lastSequence + 1;
    }

    return `INV${year}${String(sequence).padStart(5, '0')}`;
  }
}