import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entities/post.entity';

export class PostResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Titre français' })
  title_fr: string;

  @ApiProperty({ example: 'English title' })
  title_en: string;

  @ApiProperty({ example: 'Título español' })
  title_es: string;

  @ApiProperty({ example: 'Contenu français complet...' })
  content_fr: string;

  @ApiProperty({ example: 'English content...' })
  content_en: string;

  @ApiProperty({ example: 'Contenido español...' })
  content_es: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true })
  image: string | null;

  @ApiProperty({ example: true })
  show_in_carousel: boolean;

  @ApiProperty({ enum: PostStatus, example: PostStatus.PUBLISHED })
  status: PostStatus;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
