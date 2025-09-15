import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Projects } from 'db/entitis/Projects';
import { Translations } from 'db/entitis/Translations';

@Entity()
export class NameSpace {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name: string;

  @ManyToOne('Projects', { ref: true })
  project: Projects;

  @OneToMany('Translations', 'nameSpace')
  translations: Translations[] = [];
}
