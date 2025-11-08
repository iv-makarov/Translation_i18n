import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'My project',
  })
  @IsString({ message: 'Project name must be a string' })
  @IsNotEmpty({ message: 'Project name is required' })
  @Length(2, 100, {
    message: 'Project name must be between 2 and 100 characters',
  })
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Description of my project',
  })
  @IsString({ message: 'Project description must be a string' })
  @IsNotEmpty({ message: 'Project description is required' })
  @Length(2, 1000, {
    message: 'Project description must be between 2 and 1000 characters',
  })
  description: string;

  @ApiProperty({
    description: 'White list of URLs for the project',
    example: ['https://example.com', 'https://test.com'],
    required: false,
    type: [String],
  })
  @IsOptional({ message: 'White URLs are optional' })
  @IsArray({ message: 'White URLs must be an array' })
  @IsString({ each: true, message: 'Each white URL must be a string' })
  @IsUrl({}, { each: true, message: 'Each URL must be valid' })
  whiteUrls?: string[];

  @ApiProperty({
    description: 'Namespaces for the project',
    example: ['my-project-namespace', 'another-namespace'],
    required: false,
    type: [String],
  })
  @IsOptional({ message: 'Namespaces are optional' })
  @IsArray({ message: 'Namespaces must be an array' })
  @IsString({ each: true, message: 'Each namespace must be a string' })
  @Length(2, 100, {
    message: 'Each namespace must be between 2 and 100 characters',
  })
  nameSpaces?: string[];
}
