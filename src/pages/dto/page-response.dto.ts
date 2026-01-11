import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'home', description: 'Slug de la page' })
  slug: string;

  @ApiProperty({ example: 'Contenu de la page d\'accueil...', nullable: true })
  content_fr: string | null;

  @ApiProperty({ example: 'Home page content...', nullable: true })
  content_en: string | null;

  @ApiProperty({ example: 'Contenido de la página de inicio...', nullable: true })
  content_es: string | null;

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true })
  image: string | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
