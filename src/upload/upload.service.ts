import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('UPLOAD_DEST', './uploads');
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Validation type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, WEBP');
    }

    // Validation taille (5MB par défaut)
    const maxSize = this.configService.get('MAX_FILE_SIZE', 5242880);
    if (file.size > maxSize) {
      throw new BadRequestException(`Fichier trop volumineux. Taille max: ${maxSize / 1024 / 1024}MB`);
    }

    // Générer nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}-${randomString}${extension}`;
    const filepath = path.join(this.uploadPath, filename);

    // Sauvegarder le fichier
    fs.writeFileSync(filepath, file.buffer);

    // Retourner l'URL relative
    const url = `/uploads/${filename}`;
    return { url, filename };
  }
}
