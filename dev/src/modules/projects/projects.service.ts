import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Projects } from 'db/entitis/Projects';
import { User } from 'db/entitis/User';
import { FilterProjectsDto } from 'src/modules/projects/dto/filterProjects.dto';
import { CreateProjectDto } from './dto/createProjects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly em: EntityManager) {}

  async getProjects(filterProjectsDto: FilterProjectsDto) {
    const [data, total] = await this.em.findAndCount(
      Projects,
      {},
      {
        limit: filterProjectsDto.limit,
        offset: (filterProjectsDto.page - 1) * filterProjectsDto.limit,
        orderBy: {
          createdAt: 'DESC',
        },
        populate: ['user'],
      },
    );

    return {
      data,
      total,
      page: filterProjectsDto.page,
      limit: filterProjectsDto.limit,
    };
  }

  async getProjectsByUser(
    userId: string,
    filterProjectsDto: FilterProjectsDto,
  ) {
    const [data, total] = await this.em.findAndCount(
      Projects,
      { user: { id: userId } },
      {
        limit: filterProjectsDto.limit,
        offset: (filterProjectsDto.page - 1) * filterProjectsDto.limit,
        orderBy: {
          createdAt: 'DESC',
        },
        populate: ['user'],
      },
    );

    return {
      data,
      total,
      page: filterProjectsDto.page,
      limit: filterProjectsDto.limit,
    };
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const user = await this.em.findOne(User, { id: createProjectDto.userId });

    if (!user) {
      throw new BadRequestException(
        `User with id ${createProjectDto.userId} not found`,
      );
    }

    const project = this.em.create(Projects, {
      name: createProjectDto.name,
      description: createProjectDto.description,
      isBlocked: createProjectDto.isBlocked,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
    });

    this.em.persist(project);
    await this.em.flush();
    return project;
  }

  async deleteProject(id: string) {
    const project = await this.em.findOne(Projects, { id });

    if (!project) {
      throw new BadRequestException(`Project with id ${id} not found`);
    }

    this.em.remove(project);
    await this.em.flush();
    return { message: 'Project deleted successfully' };
  }
}
