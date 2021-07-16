import {
  Entity,
  Column
} from 'typeorm';

import { Base } from './base.entity';

@Entity()
export class Roles extends Base {
  @Column()
  roleName: string;

  @Column({ default: '' })
  permissions: string;
}
