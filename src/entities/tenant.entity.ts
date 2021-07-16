import {
  Entity,
  Column,
  OneToMany
} from 'typeorm';

import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Tenant extends Base {
  @Column()
  tenantName: string;

  @Column({ default: '' })
  inviteCode: string;

  @OneToMany(() => User, user => user.tenant)
  user: [User];
}
