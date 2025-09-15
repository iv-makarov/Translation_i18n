import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FilterProjectsDto {
  @ApiProperty({
    description: 'Номер страницы для пагинации',
    example: 1,
    required: false,
    minimum: 1,
  })
  @Transform(({ value }) => (value ? parseInt(String(value), 10) : 1))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: 'Количество проектов на странице',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => (value ? parseInt(String(value), 10) : 10))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({
    description:
      'Поисковый запрос для фильтрации проектов по названию или описанию',
    example: 'project',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Фильтр по статусу верификации проекта',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    description: 'Фильтр по статусу блокировки проекта',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @Type(() => Boolean)
  @IsBoolean()
  isBlocked?: boolean;
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
