import {
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Projects } from './Projects';
import { Translations } from './Translations';

@Entity()
@Index({ properties: ['name'] })
@Index({ properties: ['project'] })
export class SubProjects {
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

  @ManyToOne(() => Projects)
  project: Projects;

  @OneToMany(() => Translations, (translation) => translation.subProject, {
    cascade: [],
  })
  translations = new Collection<Translations>(this);
}
