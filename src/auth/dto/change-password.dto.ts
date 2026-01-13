import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Ancien mot de passe',
    example: 'ancienMotDePasse123',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'Nouveau mot de passe',
    example: 'nouveauMotDePasse123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  newPassword: string;
}
