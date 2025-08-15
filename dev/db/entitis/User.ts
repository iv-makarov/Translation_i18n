import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Projects } from './Projects';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  lastName: string;

  @Property()
  firstName: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;

  @Property({ default: UserRole.USER })
  role: UserRole;

  @Property()
  isActive: boolean = true;

  @Property()
  lastLoginAt?: Date;

  @Property({ nullable: true })
  refreshToken?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @OneToMany(() => Projects, (project) => project.user)
  projects?: Projects[];
}
