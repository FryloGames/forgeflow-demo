// apps/api/src/jobs/jobs.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { JobsService } from './jobs.service';
  import { CreateJobDto } from './dto/create-job.dto';
  import { UpdateJobDto } from './dto/update-job.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('jobs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('jobs')
  export class JobsController {
    constructor(private readonly jobsService: JobsService) {}
  
    @Post()
    create(@Body() createJobDto: CreateJobDto) {
      return this.jobsService.create(createJobDto);
    }
  
    @Get()
    findAll(
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('status') status?: string,
    ) {
      return this.jobsService.findAll(page, limit, status);
    }
  
    @Get('board')
    getJobBoard() {
      return this.jobsService.getJobBoard();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.jobsService.findOne(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
      return this.jobsService.update(id, updateJobDto);
    }
  
    @Patch(':jobId/phases/:phaseId/status')
    updatePhaseStatus(
      @Param('jobId') jobId: string,
      @Param('phaseId') phaseId: string,
      @Body('status') status: string,
    ) {
      return this.jobsService.updatePhaseStatus(jobId, phaseId, status);
    }
  }