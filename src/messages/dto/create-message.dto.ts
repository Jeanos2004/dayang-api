import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Nom du contact',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email du contact',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Numéro de téléphone du contact (optionnel)',
    example: '+33 6 12 34 56 78',
    required: false,
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({
    description: 'Message',
    example: 'Bonjour, je souhaite obtenir des informations...',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
