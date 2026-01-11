import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'Titre en français',
    example: 'Nouveau service de transport',
  })
  @IsString()
  @IsNotEmpty()
  title_fr: string;

  @ApiProperty({
    description: 'Titre en anglais',
    example: 'New transport service',
  })
  @IsString()
  @IsNotEmpty()
  title_en: string;

  @ApiProperty({
    description: 'Titre en espagnol',
    example: 'Nuevo servicio de transporte',
  })
  @IsString()
  @IsNotEmpty()
  title_es: string;

  @ApiProperty({
    description: 'Contenu en français',
    example: 'Découvrez notre nouveau service...',
  })
  @IsString()
  @IsNotEmpty()
  content_fr: string;

  @ApiProperty({
    description: 'Contenu en anglais',
    example: 'Discover our new service...',
  })
  @IsString()
  @IsNotEmpty()
  content_en: string;

  @ApiProperty({
    description: 'Contenu en espagnol',
    example: 'Descubre nuestro nuevo servicio...',
  })
  @IsString()
  @IsNotEmpty()
  content_es: string;

  @ApiPropertyOptional({
    description: 'URL de l\'image',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Afficher dans le carousel',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  show_in_carousel?: boolean;

  @ApiPropertyOptional({
    description: 'Statut de la publication',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
