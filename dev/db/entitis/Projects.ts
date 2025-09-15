import {
  Entity,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { NameSpace } from './NameSpace';
import { WhiteUrl } from './WhiteUrl';

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

  @OneToMany(() => WhiteUrl, (whiteUrl) => whiteUrl.project)
  whiteUrls: WhiteUrl[] = [];

  @OneToMany(() => NameSpace, (nameSpace) => nameSpace.project)
  nameSpaces: NameSpace[] = [];

  // @ManyToOne(() => User, { nullable: true })
  // user: User;
}
