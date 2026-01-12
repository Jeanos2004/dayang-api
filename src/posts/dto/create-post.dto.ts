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
    description: 'URL de l\'image (obligatoire)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({
    description: 'Titre en français',
    example: 'Nouveau service de transport',
  })
  @IsString()
  @IsOptional()
  title_fr?: string;

  @ApiPropertyOptional({
    description: 'Titre en anglais',
    example: 'New transport service',
  })
  @IsString()
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({
    description: 'Titre en espagnol',
    example: 'Nuevo servicio de transporte',
  })
  @IsString()
  @IsOptional()
  title_es?: string;

  @ApiPropertyOptional({
    description: 'Contenu en français',
    example: 'Découvrez notre nouveau service...',
  })
  @IsString()
  @IsOptional()
  content_fr?: string;

  @ApiPropertyOptional({
    description: 'Contenu en anglais',
    example: 'Discover our new service...',
  })
  @IsString()
  @IsOptional()
  content_en?: string;

  @ApiPropertyOptional({
    description: 'Contenu en espagnol',
    example: 'Descubre nuestro nuevo servicio...',
  })
  @IsString()
  @IsOptional()
  content_es?: string;

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
