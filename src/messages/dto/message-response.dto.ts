import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({
    example: '+33 6 12 34 56 78',
    nullable: true,
    description: 'Numéro de téléphone (optionnel)',
  })
  telephone: string | null;

  @ApiProperty({ example: 'Bonjour, je souhaite obtenir des informations sur vos services...' })
  message: string;

  @ApiProperty({ example: false })
  is_read: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
