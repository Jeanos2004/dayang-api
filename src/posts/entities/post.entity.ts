import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title_fr: string;

  @Column()
  title_en: string;

  @Column()
  title_es: string;

  @Column('text')
  content_fr: string;

  @Column('text')
  content_en: string;

  @Column('text')
  content_es: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  show_in_carousel: boolean;

  @Column({
    type: 'varchar',
    default: PostStatus.DRAFT,
  })
  status: PostStatus;
}
