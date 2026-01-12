import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email de l\'administrateur',
    example: 'admin@dayang.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
