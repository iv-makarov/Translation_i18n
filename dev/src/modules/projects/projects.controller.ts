import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeleteProjectDto } from 'src/modules/projects/dto/deleteProject.dto';
import { CreateProjectDto } from './dto/createProjects.dto';
import { ProjectsService } from './projects.service';
import { GetProjectsDto } from 'src/modules/projects/dto/getProjects.dto';
import {
  CreateProjectResponseDto,
  DeleteProjectResponseDto,
  GetProjectByIdResponseDto,
  GetProjectsResponseDto,
} from 'src/modules/projects/dto/response.dto';
import { GetProjectByIdDto } from 'src/modules/projects/dto/getProjectById.dto';
import { ErrorResponseDto } from 'src/modules/auth/dto/response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('getProjects')
  @ApiResponse({
    status: 200,
    description: 'Projects',
    type: GetProjectsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async getProjects(
    @Query() getProjectsDto: GetProjectsDto,
  ): Promise<GetProjectsResponseDto> {
    return (await this.projectsService.getProjects(
      getProjectsDto,
    )) as unknown as GetProjectsResponseDto;
  }

  @Get('getProject/:id')
  @ApiResponse({
    status: 200,
    description: 'Project',
    type: GetProjectByIdResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async getProjectById(
    @Body() getProjectByIdDto: GetProjectByIdDto,
  ): Promise<GetProjectByIdResponseDto> {
    return (await this.projectsService.getProjectById(
      getProjectByIdDto.id,
    )) as unknown as GetProjectByIdResponseDto;
  }

  @Post('createProject')
  @ApiResponse({
    status: 200,
    description: 'Project created successfully',
    type: CreateProjectResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete('deleteProject/:id')
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    type: DeleteProjectResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async deleteProject(
    @Body() deleteProjectDto: DeleteProjectDto,
  ): Promise<DeleteProjectResponseDto> {
    return (await this.projectsService.deleteProject(
      deleteProjectDto.id,
    )) as unknown as DeleteProjectResponseDto;
  }
}
