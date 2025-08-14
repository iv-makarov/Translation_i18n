import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SubProjects } from 'db/entitis/SubProjects';
import { FiltersSubProjectDto } from 'src/modules/subProjects/dto/filtersSubProject.dto';

@Injectable()
export class SubProjectsService {
  constructor(private readonly em: EntityManager) {}

  async getSubProjectsAll(filters: FiltersSubProjectDto) {
    const where: Record<string, any> = {};

    if (filters.search) {
      where.name = { $like: `%${filters.search}%` };
    }

    const [data, total] = await this.em.findAndCount(SubProjects, where, {
      limit: filters.limit,
      offset: filters.page ? (filters.page - 1) * filters.limit : 0,
      orderBy: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async getSubProjectsByProjectId(projectId: string) {
    return this.em.find(SubProjects, { project: projectId });
  }

  async createSubProject(subProject: SubProjects) {
    return this.em.persistAndFlush(subProject);
  }

  async updateSubProject(id: string, subProject: SubProjects) {
    const subProjectFind = await this.em.findOne(SubProjects, { id });
    if (!subProjectFind) {
      throw new NotFoundException('Sub project not found');
    }
    return this.em.persistAndFlush(subProject);
  }

  async deleteSubProject(id: string) {
    const subProject = await this.em.findOne(SubProjects, { id });
    if (!subProject) {
      throw new NotFoundException('Sub project not found');
    }
    return this.em.removeAndFlush(subProject);
  }
}
