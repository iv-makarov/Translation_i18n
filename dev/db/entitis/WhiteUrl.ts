import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Projects } from 'db/entitis/Projects';

@Entity()
export class WhiteUrl {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  url: string;

  @ManyToOne(() => Projects, { ref: true })
  project: Projects;
}
