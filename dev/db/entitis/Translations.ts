import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { NameSpace } from 'db/entitis/NameSpace';
import { Projects } from 'db/entitis/Projects';

@Entity()
@Index({ properties: ['key', 'lang', 'nameSpace'] })
@Index({ properties: ['project'] })
export class Translations {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  key: string;

  @ManyToOne('NameSpace', { ref: true })
  nameSpace: NameSpace;

  @Property()
  value: string;

  @Property()
  lang: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property()
  isVerified: boolean = false;

  @ManyToOne('Projects', { ref: true })
  project: Projects;
}
