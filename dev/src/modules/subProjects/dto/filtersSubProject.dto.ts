import { ApiProperty } from '@nestjs/swagger';

export class FiltersSubProjectDto {
  @ApiProperty({
    description: 'Идентификатор проекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  page: number;

  @ApiProperty({
    description: 'Название подпроекта',
    example: 'SubProject',
  })
  limit: number;

  @ApiProperty({
    description: 'Поисковый запрос',
    example: 'SubProject',
  })
  search: string;
}
