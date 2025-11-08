import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProjectsDto {
  @ApiProperty({
    description: 'Page',
    example: 1,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Page must be a number' },
  )
  page: number = 1;

  @ApiProperty({
    description: 'Limit',
    example: 10,
    required: false,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Limit must be a number' },
  )
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    description: 'Search',
    example: 'project',
    required: false,
  })
  @IsString({ message: 'Search must be a string' })
  @IsOptional()
  search: string = '';

  @ApiProperty({
    description: 'Is verified',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Is verified must be a boolean' })
  @IsOptional()
  isVerified: boolean = false;

  @ApiProperty({
    description: 'Is blocked',
    example: true,
  })
  @IsBoolean({ message: 'Is blocked must be a boolean' })
  @IsOptional()
  isBlocked: boolean = false;
}
