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
  DeleteProjectResponseDto,
  GetProjectByIdResponseDto,
  GetProjectsResponseDto,
} from 'src/modules/projects/dto/response.dto';
import { GetProjectByIdDto } from 'src/modules/projects/dto/getProjectById.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('getProjects')
  async getProjects(
    @Query() getProjectsDto: GetProjectsDto,
  ): Promise<GetProjectsResponseDto> {
    return (await this.projectsService.getProjects(
      getProjectsDto,
    )) as unknown as GetProjectsResponseDto;
  }

  @Get('getProject/:id')
  async getProjectById(
    @Body() getProjectByIdDto: GetProjectByIdDto,
  ): Promise<GetProjectByIdResponseDto> {
    return (await this.projectsService.getProjectById(
      getProjectByIdDto.id,
    )) as unknown as GetProjectByIdResponseDto;
  }

  @Post('createProject')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete('deleteProject/:id')
  async deleteProject(
    @Body() deleteProjectDto: DeleteProjectDto,
  ): Promise<DeleteProjectResponseDto> {
    return (await this.projectsService.deleteProject(
      deleteProjectDto.id,
    )) as unknown as DeleteProjectResponseDto;
  }
}
