import {
  Collection,
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { SubProjects } from './SubProjects';

@Entity()
@Index({ properties: ['name'] })
@Index({ properties: ['isVerified', 'isBlocked'] })
export class Projects {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property()
  isVerified: boolean = false;

  @Property()
  isBlocked: boolean = false;

  @OneToMany(() => SubProjects, (subProject) => subProject.project, {
    cascade: [],
  })
  subProjects = new Collection<SubProjects>(this);
}
