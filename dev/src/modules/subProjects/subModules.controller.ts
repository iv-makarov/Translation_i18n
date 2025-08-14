import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SubProjectsService } from './subProjects.service';
import { SubProjects } from 'db/entitis/SubProjects';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SubProjectDto } from 'src/modules/subProjects/dto/subProject.dto';
import { FiltersSubProjectDto } from 'src/modules/subProjects/dto/filtersSubProject.dto';

@Controller('sub-projects')
export class SubProjectsController {
  constructor(private readonly subProjectsService: SubProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все подпроекты' })
  @ApiResponse({ status: 200, type: [SubProjectDto] })
  @ApiQuery({ type: FiltersSubProjectDto })
  async getSubProjectsAll(@Query() filters: FiltersSubProjectDto) {
    return this.subProjectsService.getSubProjectsAll(filters);
  }

  @Get(':id')
  async getSubProjectsByProjectId(@Param('id') id: string) {
    return this.subProjectsService.getSubProjectsByProjectId(id);
  }

  @Post()
  async createSubProject(@Body() subProject: SubProjects) {
    return this.subProjectsService.createSubProject(subProject);
  }

  @Put(':id')
  async updateSubProject(
    @Param('id') id: string,
    @Body() subProject: SubProjects,
  ) {
    return this.subProjectsService.updateSubProject(id, subProject);
  }

  @Delete(':id')
  async deleteSubProject(@Param('id') id: string) {
    return this.subProjectsService.deleteSubProject(id);
  }
}
