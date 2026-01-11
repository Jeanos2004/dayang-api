import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('pages')
@Index(['slug'], { unique: true })
export class Page extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  content_fr: string;

  @Column('text', { nullable: true })
  content_en: string;

  @Column('text', { nullable: true })
  content_es: string;

  @Column({ nullable: true })
  image: string;
}
