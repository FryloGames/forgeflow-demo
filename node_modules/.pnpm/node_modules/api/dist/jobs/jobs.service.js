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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/database/prisma.service");
let JobsService = class JobsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createJobDto) {
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
    async findAll(page = 1, limit = 10, status) {
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
    async findOne(id) {
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
    async update(id, updateJobDto) {
        return this.prisma.job.update({
            where: { id },
            data: updateJobDto,
            include: {
                customer: true,
                phases: true,
            },
        });
    }
    async updatePhaseStatus(jobId, phaseId, status) {
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
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map