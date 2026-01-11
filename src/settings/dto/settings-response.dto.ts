import { ApiProperty } from '@nestjs/swagger';

export class SettingsResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Dayang Transport' })
  site_name: string;

  @ApiProperty({ example: 'https://example.com/logo.png', nullable: true })
  logo: string | null;

  @ApiProperty({ example: 'contact@dayang.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '+33 1 23 45 67 89', nullable: true })
  phone: string | null;

  @ApiProperty({
    example: {
      facebook: 'https://facebook.com/dayang',
      twitter: 'https://twitter.com/dayang',
      linkedin: 'https://linkedin.com/company/dayang',
    },
    nullable: true,
  })
  social_links: Record<string, string> | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
