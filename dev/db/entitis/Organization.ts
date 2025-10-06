import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Organization {
  @PrimaryKey()
  id: string = crypto.randomUUID();

  @Property()
  name: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ type: 'json', nullable: true })
  userIds: string[] = [];
}
