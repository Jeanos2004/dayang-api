import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { VALID_SLUGS } from '../constants/valid-slugs.constant';

export class CreatePageDto {
  @ApiProperty({
    description: 'Slug de la page (home, about, services, contact)',
    example: 'home',
    enum: VALID_SLUGS,
  })
  @IsNotEmpty({ message: 'Le slug est requis' })
  @IsString()
  @IsIn(VALID_SLUGS, { message: 'Le slug doit être un des suivants: home, about, services, contact' })
  slug: string;

  @ApiProperty({
    description: 'Contenu de la page en français',
    example: 'Contenu de la page d\'accueil en français...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_fr?: string;

  @ApiProperty({
    description: 'Contenu de la page en anglais',
    example: 'Home page content in English...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_en?: string;

  @ApiProperty({
    description: 'Contenu de la page en espagnol',
    example: 'Contenido de la página de inicio en español...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_es?: string;

  @ApiProperty({
    description: 'URL de l\'image de la page',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
