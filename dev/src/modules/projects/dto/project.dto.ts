import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор проекта',
    example: 'ca2b82f0-e49c-42ad-a105-b76043ea425b',
  })
  id: string;

  @ApiProperty({
    description: 'Название проекта',
    example: 'Мой проект',
  })
  name: string;

  @ApiProperty({
    description: 'Описание проекта',
    example: 'Описание моего проекта',
  })
  description: string;

  @ApiProperty({
    description: 'Дата создания проекта',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления проекта',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Статус верификации проекта',
    example: false,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Статус блокировки проекта',
    example: false,
  })
  isBlocked: boolean;
}

export class ProjectsListResponseDto {
  @ApiProperty({
    description: 'Массив проектов',
    type: [ProjectResponseDto],
  })
  data: ProjectResponseDto[];

  @ApiProperty({
    description: 'Общее количество проектов',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество проектов на странице',
    example: 10,
  })
  limit: number;
}
