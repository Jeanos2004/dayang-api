import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('settings')
export class Setting extends BaseEntity {
  @Column({ default: 'Dayang Transport' })
  site_name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('json', { nullable: true })
  social_links: Record<string, string>;
}
