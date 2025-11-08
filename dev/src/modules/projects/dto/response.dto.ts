import { ApiProperty } from '@nestjs/swagger';
import { Projects } from 'db';

export class CreateProjectResponseDto {
  @ApiProperty({
    description: 'Success create project message',
    example: 'Project created successfully',
  })
  message: string;
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class GetProjectsResponseDto {
  @ApiProperty({
    description: 'Projects',
    type: [Projects],
  })
  projects: Projects[];
}

export class GetProjectByIdResponseDto {
  @ApiProperty({
    description: 'Project',
    type: Projects,
  })
  project: Projects;
}

export class DeleteProjectResponseDto {
  @ApiProperty({
    description: 'Success delete project message',
    example: 'Project deleted successfully',
  })
  message: string;
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}
