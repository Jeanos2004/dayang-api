import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import * as bcrypt from 'bcrypt';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
