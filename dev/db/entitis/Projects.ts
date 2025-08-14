import {
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { SubProjects } from './SubProjects';
import { User } from './User';

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

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => SubProjects, (subProject) => subProject.project, {
    cascade: [],
  })
  subProjects = new Collection<SubProjects>(this);
}
