// apps/api/src/wps/wps.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class WpsService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: string) {
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
}
