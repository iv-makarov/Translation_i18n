import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class PasswordResetToken {
  // ID
  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  // User ID
  @ManyToOne(() => Users, { nullable: false, cascade: [Cascade.REMOVE] })
  user: Users;

  // Token Hash
  @Property({ nullable: false, type: 'text' })
  tokenHash: string;

  // Expires At
  @Property({ nullable: false, type: 'date' })
  expiresAt: Date;
}
