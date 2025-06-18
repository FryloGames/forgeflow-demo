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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/database/prisma.service");
let BillingService = class BillingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvoice(data) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: data.customerId },
        });
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
    getTaxRates(province) {
        const rates = {
            'AB': { gstHst: 0.05, pst: 0 },
            'BC': { gstHst: 0.05, pst: 0.07 },
            'ON': { gstHst: 0.13, pst: 0 },
            'QC': { gstHst: 0.05, pst: 0.09975 },
        };
        return rates[province] || { gstHst: 0.05, pst: 0 };
    }
    async generateInvoiceNumber() {
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
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map