import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NameSpace } from 'db/entitis/NameSpace';
import { Projects } from 'db/entitis/Projects';
import { WhiteUrl } from 'db/entitis/WhiteUrl';
import { FilterProjectsDto } from 'src/modules/projects/dto/filterProjects.dto';
import { CreateProjectDto } from './dto/createProjects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly em: EntityManager) {}

  async getProjects(filterProjectsDto: FilterProjectsDto) {
    const page = filterProjectsDto.page ?? 1;
    const limit = filterProjectsDto.limit ?? 10;

    const [data, total] = await this.em.findAndCount(
      Projects,
      {},
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: {
          createdAt: 'DESC',
        },
        populate: ['whiteUrls', 'nameSpaces'],
      },
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async createProject(createProjectDto: CreateProjectDto) {
    const project = this.em.create(Projects, {
      name: createProjectDto.name,
      description: createProjectDto.description,
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      whiteUrls: [],
      nameSpaces: [],
    });

    this.em.persist(project);
    await this.em.flush();

    // Создаем и связываем WhiteUrls
    if (createProjectDto.whiteUrls && createProjectDto.whiteUrls.length > 0) {
      const whiteUrls = createProjectDto.whiteUrls.map((url) =>
        this.em.create(WhiteUrl, { url, project }),
      );
      project.whiteUrls = whiteUrls;
      this.em.persist(whiteUrls);
    }

    // Создаем и связываем NameSpaces
    if (createProjectDto.nameSpaces && createProjectDto.nameSpaces.length > 0) {
      const nameSpaces = createProjectDto.nameSpaces.map((name) =>
        this.em.create(NameSpace, { name, project, translations: [] }),
      );
      project.nameSpaces = nameSpaces;
      this.em.persist(nameSpaces);
    }

    await this.em.flush();

    // Загружаем связанные данные для возврата
    await this.em.populate(project, ['whiteUrls', 'nameSpaces']);

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
