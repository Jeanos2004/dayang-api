import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePageDto {
  @ApiPropertyOptional({
    description: 'Contenu en français',
    example: 'Contenu de la page...',
  })
  @IsString()
  @IsOptional()
  content_fr?: string;

  @ApiPropertyOptional({
    description: 'Contenu en anglais',
    example: 'Page content...',
  })
  @IsString()
  @IsOptional()
  content_en?: string;

  @ApiPropertyOptional({
    description: 'Contenu en espagnol',
    example: 'Contenido de la página...',
  })
  @IsString()
  @IsOptional()
  content_es?: string;

  @ApiPropertyOptional({
    description: 'URL de l\'image',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  image?: string;
}
