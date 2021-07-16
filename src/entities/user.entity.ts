import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId
} from 'typeorm';

import { Base } from './base.entity';
import { Tenant } from './tenant.entity';

@Entity()
export class User extends Base {
  @Column({ nullable: true, default: 'Guest' })
  fullName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  code: string;

  @Column({ default: "user" })
  roles: string;

  @Column({ default: '' })
  additionalPermissions: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ nullable: true })
  firebaseId: string;

  @ManyToOne(() => Tenant, tenant => tenant.user)
  @JoinColumn()
  tenant: Tenant
  @RelationId((user: User) => user.tenant)
  tenantId: number;

  /**
   * 0. Suspended
   * 1. Pending verification
   * 2. Verified
   * 3. Approved
   * 
   * @type {number}
   * @memberof User
   */
  @Column({ default: 1 })
  status: number;

}
