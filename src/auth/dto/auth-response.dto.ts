import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT pour l\'authentification',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Informations de l\'utilisateur',
    example: {
      id: 'uuid-here',
      email: 'admin@example.com',
    },
  })
  user: {
    id: string;
    email: string;
  };
}
