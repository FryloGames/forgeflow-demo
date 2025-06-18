// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { MaterialsModule } from './materials/materials.module';
import { WpsModule } from './wps/wps.module';
import { TimecardsModule } from './timecards/timecards.module';
import { BillingModule } from './billing/billing.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaService } from './common/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    JobsModule,
    MaterialsModule,
    WpsModule,
    TimecardsModule,
    BillingModule,
    DispatchModule,
    ReportsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}