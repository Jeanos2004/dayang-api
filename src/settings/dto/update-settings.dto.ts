import { IsString, IsOptional, IsObject, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    description: 'Nom du site',
    example: 'Dayang Transport',
  })
  @IsString()
  @IsOptional()
  site_name?: string;

  @ApiPropertyOptional({
    description: 'URL du logo',
    example: 'https://example.com/logo.png',
  })
  @IsUrl()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Email de contact',
    example: 'contact@dayang.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Téléphone de contact',
    example: '+33 1 23 45 67 89',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Liens des réseaux sociaux',
    example: {
      facebook: 'https://facebook.com/dayang',
      twitter: 'https://twitter.com/dayang',
      linkedin: 'https://linkedin.com/company/dayang',
    },
  })
  @IsObject()
  @IsOptional()
  social_links?: Record<string, string>;
}
