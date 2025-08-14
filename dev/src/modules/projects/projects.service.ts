import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Projects } from 'db/entitis/Projects';
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
    const project = this.em.create(Projects, {
      ...createProjectDto,
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
      throw new Error(`Project with id ${id} not found`);
    }

    this.em.remove(project);
    await this.em.flush();
    return { message: 'Project deleted successfully' };
  }
}
