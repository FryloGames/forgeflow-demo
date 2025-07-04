import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaService } from '../common/database/prisma.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}