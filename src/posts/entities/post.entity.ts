import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ nullable: true })
  title_fr: string;

  @Column({ nullable: true })
  title_en: string;

  @Column({ nullable: true })
  title_es: string;

  @Column('text', { nullable: true })
  content_fr: string;

  @Column('text', { nullable: true })
  content_en: string;

  @Column('text', { nullable: true })
  content_es: string;

  @Column()
  image: string;

  @Column({ default: false })
  show_in_carousel: boolean;

  @Column({
    type: 'varchar',
    default: PostStatus.DRAFT,
  })
  status: PostStatus;
}
