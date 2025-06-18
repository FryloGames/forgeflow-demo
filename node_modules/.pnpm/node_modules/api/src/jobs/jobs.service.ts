// apps/api/src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        phases: {
          create: [
            { name: 'Cut', sequence: 1 },
            { name: 'Fit-Up', sequence: 2 },
            { name: 'Weld', sequence: 3 },
            { name: 'Grind', sequence: 4 },
            { name: 'Paint', sequence: 5 },
            { name: 'QA', sequence: 6 },
            { name: 'Delivery', sequence: 7 },
          ],
        },
      },
      include: {
        customer: true,
        phases: true,
        createdBy: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          phases: true,
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        customer: true,
        phases: {
          include: {
            tasks: true,
          },
        },
        drawings: true,
        bomItems: {
          include: {
            material: true,
          },
        },
        timecards: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        createdBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        customer: true,
        phases: true,
      },
    });
  }

  async updatePhaseStatus(jobId: string, phaseId: string, status: string) {
    return this.prisma.jobPhase.update({
      where: { id: phaseId, jobId },
      data: { 
        status,
        startDate: status === 'IN_PROGRESS' ? new Date() : undefined,
        endDate: status === 'COMPLETED' ? new Date() : undefined,
      },
    });
  }

  async getJobBoard() {
    const jobs = await this.prisma.job.findMany({
      where: { status: 'IN_PROGRESS' },
      include: {
        customer: true,
        phases: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: { priority: 'desc' },
    });

    // Group jobs by phase status for Kanban board
    const board = {
      pending: [],
      inProgress: [],
      completed: [],
    };

    jobs.forEach(job => {
      job.phases.forEach(phase => {
        const jobPhase = {
          id: phase.id,
          jobId: job.id,
          jobTitle: job.title,
          customer: job.customer.name,
          phase: phase.name,
          status: phase.status,
          tasks: phase.tasks.length,
          completedTasks: phase.tasks.filter(t => t.status === 'COMPLETED').length,
        };

        switch (phase.status) {
          case 'PENDING':
            board.pending.push(jobPhase);
            break;
          case 'IN_PROGRESS':
            board.inProgress.push(jobPhase);
            break;
          case 'COMPLETED':
            board.completed.push(jobPhase);
            break;
        }
      });
    });

    return board;
  }
}