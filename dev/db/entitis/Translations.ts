import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { SubProjects } from './SubProjects';

@Entity()
@Index({ properties: ['key', 'lang', 'namespace'] })
@Index({ properties: ['subProject'] })
export class Translations {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  key: string;

  @Property()
  namespace: string;

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

  @ManyToOne(() => SubProjects)
  subProject: SubProjects;
}
