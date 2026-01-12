import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
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
import { CurrentUser } from '../common/decorators/current-user.decorator';

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

  // ========== GESTION IMAGE DE PROFIL ADMIN ==========

  @Post('profile')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Uploader/mettre à jour l\'image de profil (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image de profil (JPEG, PNG, GIF, WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image de profil uploadée avec succès (remplace l\'ancienne si elle existe)',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/.../profile.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de l\'upload' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Admin non trouvé' })
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string; email: string },
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return this.uploadService.uploadProfileImage(user.id, file);
  }

  @Put('profile')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Mettre à jour l\'image de profil (Admin) - Alias de POST' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image de profil (JPEG, PNG, GIF, WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image de profil mise à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/.../profile.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de l\'upload' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Admin non trouvé' })
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string; email: string },
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return this.uploadService.uploadProfileImage(user.id, file);
  }

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Mettre à jour partiellement l\'image de profil (Admin) - Alias de POST' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image de profil (JPEG, PNG, GIF, WEBP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image de profil mise à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/.../profile.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Erreur lors de l\'upload' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Admin non trouvé' })
  async patchProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string; email: string },
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return this.uploadService.uploadProfileImage(user.id, file);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer l\'image de profil de l\'admin connecté' })
  @ApiResponse({
    status: 200,
    description: 'URL de l\'image de profil (null si aucune image)',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          nullable: true,
          example: 'https://res.cloudinary.com/.../profile.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Admin non trouvé' })
  async getProfileImage(@CurrentUser() user: { id: string; email: string }) {
    return this.uploadService.getProfileImage(user.id);
  }

  @Delete('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer l\'image de profil de l\'admin connecté' })
  @ApiResponse({
    status: 200,
    description: 'Image de profil supprimée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Image de profil supprimée avec succès',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Admin non trouvé' })
  async deleteProfileImage(@CurrentUser() user: { id: string; email: string }) {
    await this.uploadService.deleteProfileImage(user.id);
    return { message: 'Image de profil supprimée avec succès' };
  }
}
