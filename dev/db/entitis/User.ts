import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Projects } from './Projects';

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

  @Property()
  role: 'admin' | 'user' = 'user';

  @Property()
  isActive: boolean = true;

  @Property()
  lastLoginAt?: Date;

  @Property()
  refreshToken?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @OneToMany(() => Projects, (project) => project.user)
  projects?: Projects[];
}
