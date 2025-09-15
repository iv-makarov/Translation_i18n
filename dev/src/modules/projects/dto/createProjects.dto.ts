import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Название проекта',
    example: 'Мой проект',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Описание проекта',
    example: 'Описание моего проекта',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Белый список URL для проекта',
    example: ['https://example.com', 'https://test.com'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true, message: 'Каждый URL должен быть валидным' })
  whiteUrls?: string[];

  @ApiProperty({
    description: 'Пространства имен для проекта',
    example: ['my-project-namespace', 'another-namespace'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nameSpaces?: string[];
}
