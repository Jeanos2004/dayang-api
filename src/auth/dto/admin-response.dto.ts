import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updated_at: Date;
}
