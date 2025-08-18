import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './User';

@Entity()
export class PasswordResetToken {
  // ID
  @PrimaryKey({ type: 'uuid' })
  id: string = crypto.randomUUID();

  // User ID
  @ManyToOne(() => User, { nullable: false, cascade: [Cascade.REMOVE] })
  user: User;

  // Token Hash
  @Property({ nullable: false, type: 'text' })
  tokenHash: string;

  // Expires At
  @Property({ nullable: false, type: 'date' })
  expiresAt: Date;
}
