import { ApiProperty } from '@nestjs/swagger';

export class FilterProjectsDto {
  @ApiProperty({
    description: 'Номер страницы для пагинации',
    example: 1,
    required: false,
    minimum: 1,
  })
  page: number = 1;

  @ApiProperty({
    description: 'Количество проектов на странице',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  limit: number = 10;

  @ApiProperty({
    description:
      'Поисковый запрос для фильтрации проектов по названию или описанию',
    example: 'project',
    required: false,
  })
  search: string = '';

  @ApiProperty({
    description: 'Фильтр по статусу верификации проекта',
    example: true,
    required: false,
  })
  isVerified: boolean = false;

  @ApiProperty({
    description: 'Фильтр по статусу блокировки проекта',
    example: false,
    required: false,
  })
  isBlocked: boolean = false;
}

export class CreateProjectResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор созданного проекта',
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

export class DeleteProjectResponseDto {
  @ApiProperty({
    description: 'Сообщение об успешном удалении',
    example: 'Project deleted successfully',
  })
  message: string;
}
