import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Users {
  // ID
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryKey()
  id: string = crypto.randomUUID();

  // Last Name
  @ApiProperty({
    description: 'Last Name',
    example: 'Doe',
  })
  @Property({ nullable: false })
  lastName: string;

  // First Name
  @ApiProperty({
    description: 'First Name',
    example: 'John',
  })
  @Property({ nullable: false })
  firstName: string;

  // Email
  @ApiProperty({
    description: 'Email',
    example: 'john@example.com',
  })
  @Property({ nullable: false })
  @Unique()
  email: string;

  // Password
  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @Property({ nullable: false })
  passwordHash: string;

  // Role
  @ApiProperty({
    description: 'Role',
    example: 'user',
  })
  @Property({ nullable: false, type: 'enum' })
  role: UserRole = UserRole.USER;

  // Is Active
  @ApiProperty({
    description: 'Is Active',
    example: true,
  })
  @Property({ nullable: false, type: 'boolean', default: true })
  isActive: boolean = true;

  // Is Email Verified
  @ApiProperty({
    description: 'Is Email Verified',
    example: true,
  })
  @Property({ nullable: false, type: 'boolean' })
  isEmailVerified: boolean = false;

  // Created At
  @ApiProperty({
    description: 'Created At',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ nullable: false, type: 'date' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Updated At',
    example: '2021-01-01T00:00:00.000Z',
  })
  @Property({ nullable: false, type: 'date' })
  updatedAt: Date = new Date();

  @ApiProperty({
    description: 'Project IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @Property({ type: 'json', nullable: true })
  projectIds: string[] = [];

  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Property({ nullable: false })
  organizationId: string;
}
