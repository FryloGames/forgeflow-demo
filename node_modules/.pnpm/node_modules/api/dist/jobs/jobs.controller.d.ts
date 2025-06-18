import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
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
    getJobBoard(): Promise<{
        pending: any[];
        inProgress: any[];
        completed: any[];
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateJobDto: UpdateJobDto): Promise<any>;
    updatePhaseStatus(jobId: string, phaseId: string, status: string): Promise<any>;
}
