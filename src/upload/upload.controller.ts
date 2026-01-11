import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload une image (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPEG, PNG, GIF, WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploadée avec succès',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: '/uploads/image-1234567890.jpg',
        },
        filename: {
          type: 'string',
          example: 'image-1234567890.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de l\'upload' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return this.uploadService.saveFile(file);
  }
}
