import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';

@Injectable()
export class UploadService {
  private uploadPath: string;
  private useCloudinary: boolean;

  constructor(private configService: ConfigService) {
    // Configuration Cloudinary
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    this.useCloudinary = !!(cloudName && apiKey && apiSecret);

    if (this.useCloudinary) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      console.log('✅ Cloudinary configuré pour le stockage des médias');
    } else {
      // Fallback sur système de fichiers local
      const uploadDest = this.configService.get('UPLOAD_DEST', './uploads');
      this.uploadPath = path.isAbsolute(uploadDest)
        ? uploadDest
        : path.join(process.cwd(), uploadDest);
      this.ensureUploadDirectoryExists();
      console.log('⚠️  Cloudinary non configuré, utilisation du stockage local');
    }
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
    const filename = `dayang-${timestamp}-${randomString}${extension}`;

    if (this.useCloudinary) {
      // Upload vers Cloudinary
      return this.uploadToCloudinary(file, filename);
    } else {
      // Upload local (fallback)
      return this.uploadLocal(file, filename);
    }
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    filename: string,
  ): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dayang-transport',
          public_id: filename.replace(/\.[^/.]+$/, ''), // Enlever l'extension
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(new BadRequestException(`Erreur lors de l'upload Cloudinary: ${error.message}`));
          } else if (!result) {
            reject(new BadRequestException('Erreur lors de l\'upload Cloudinary: résultat vide'));
          } else {
            resolve({
              url: result.secure_url, // URL HTTPS
              filename: result.public_id,
            });
          }
        },
      );

      // Convertir le buffer en stream
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  private async uploadLocal(
    file: Express.Multer.File,
    filename: string,
  ): Promise<{ url: string; filename: string }> {
    const filepath = path.join(this.uploadPath, filename);
    fs.writeFileSync(filepath, file.buffer);
    const url = `/uploads/${filename}`;
    return { url, filename };
  }
}
