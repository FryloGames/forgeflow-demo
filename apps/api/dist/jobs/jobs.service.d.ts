import { PrismaService } from '../common/database/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createJobDto: CreateJobDto): Promise<any>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<any>;
    updatePhaseStatus(jobId: string, phaseId: string, status: string): Promise<any>;
    getJobBoard(): Promise<{
        pending: any[];
        inProgress: any[];
        completed: any[];
    }>;
}
