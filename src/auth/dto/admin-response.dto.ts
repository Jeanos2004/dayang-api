import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../profile.jpg',
    nullable: true,
    description: 'URL de l\'image de profil (null si aucune image)',
  })
  profile_image_url: string | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
