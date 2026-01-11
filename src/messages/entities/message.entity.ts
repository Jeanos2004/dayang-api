import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('messages')
@Index(['email'])
export class Message extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  is_read: boolean;
}
