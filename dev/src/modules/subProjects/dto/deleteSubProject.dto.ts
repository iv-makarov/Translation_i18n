import { ApiProperty } from '@nestjs/swagger';

export class DeleteSubProjectDto {
  @ApiProperty({
    description: 'Идентификатор подпроекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}
