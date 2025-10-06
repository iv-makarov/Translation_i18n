import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class Session {
  // access token
  @PrimaryKey({ unique: true })
  accessToken: string;

  // refresh token
  @Property({ nullable: true })
  refreshToken: string;

  // User ID
  @ManyToOne(() => Users, { nullable: false, cascade: [Cascade.REMOVE] })
  user: Users;

  // Device
  @Property({ nullable: true })
  device: string | null;

  // IP
  @Property({ nullable: true })
  ip: string | null;

  // Expires At
  @Property({ nullable: false, type: 'date' })
  expiresAt: Date;

  // Revoked
  @Property({ nullable: false, type: 'boolean' })
  revoked: boolean = false;

  // Created At
  @Property({ nullable: false, type: 'date' })
  createdAt: Date = new Date();
}
