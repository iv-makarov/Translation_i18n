import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  CreateProjectResponseDto,
  DeleteProjectResponseDto,
  FilterProjectsDto,
} from 'src/modules/projects/dto/filterProjects.dto';
import { CreateProjectDto } from './dto/createProjects.dto';
import { ProjectsListResponseDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Список проектов успешно получен',
    type: ProjectsListResponseDto,
    schema: {
      example: {
        data: [
          {
            id: 'ca2b82f0-e49c-42ad-a105-b76043ea425b',
            name: 'Мой проект',
            description: 'Описание моего проекта',
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
            isVerified: false,
            isBlocked: false,
          },
        ],
        total: 25,
        page: 1,
        limit: 10,
      },
    },
  })
  getProjects(@Query() filterProjectsDto: FilterProjectsDto) {
    return this.projectsService.getProjects(filterProjectsDto);
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId', type: String, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список проектов пользователя успешно получен',
    type: ProjectsListResponseDto,
    schema: {
      example: {
        data: [
          {
            id: 'ca2b82f0-e49c-42ad-a105-b76043ea425b',
            name: 'Мой проект',
            description: 'Описание моего проекта',
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z',
            isVerified: false,
            isBlocked: false,
          },
        ],
        total: 5,
        page: 1,
        limit: 10,
      },
    },
  })
  getProjectsByUser(
    @Param('userId') userId: string,
    @Query() filterProjectsDto: FilterProjectsDto,
  ) {
    return this.projectsService.getProjectsByUser(userId, filterProjectsDto);
  }

  @Post()
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Проект успешно создан',
    type: CreateProjectResponseDto,
    schema: {
      example: {
        id: 'ca2b82f0-e49c-42ad-a105-b76043ea425b',
        name: 'Мой проект',
        description: 'Описание моего проекта',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
        isVerified: false,
        isBlocked: false,
      },
    },
  })
  @ApiBody({ type: CreateProjectDto })
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID проекта' })
  @ApiResponse({
    status: 200,
    description: 'Проект успешно удален',
    type: DeleteProjectResponseDto,
    schema: {
      example: {
        message: 'Project deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  async deleteProject(@Param('id') id: string) {
    try {
      return await this.projectsService.deleteProject(id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
