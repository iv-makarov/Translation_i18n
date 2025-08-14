import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;
}
