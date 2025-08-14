import { ApiProperty } from '@nestjs/swagger';

export class CreateSubProjectDto {
  @ApiProperty({
    description: 'Идентификатор проекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  projectId: string;

  @ApiProperty({
    description: 'Название подпроекта',
    example: 'SubProject',
    required: true,
  })
  name: string;
}
