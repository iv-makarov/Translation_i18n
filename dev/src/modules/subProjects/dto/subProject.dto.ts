import { ApiProperty } from '@nestjs/swagger';

export class SubProjectDto {
  @ApiProperty({
    description: 'Идентификатор подпроекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Название подпроекта',
    example: 'SubProject',
  })
  name: string;

  @ApiProperty({
    description: 'Дата создания подпроекта',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления подпроекта',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Идентификатор проекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  projectId: string;

  @ApiProperty({
    description: 'Количество переводов',
    example: 10,
  })
  translationsCount: number;
}
