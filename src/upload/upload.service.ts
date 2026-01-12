import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { Admin } from '../auth/entities/admin.entity';

@Injectable()
export class UploadService {
  private uploadPath: string;
  private useCloudinary: boolean;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {

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
      console.log(`   Cloud Name: ${cloudName}`);
      console.log(`   API Key: ${apiKey.substring(0, 4)}...`);
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
      console.log(`🔄 Utilisation de Cloudinary pour l'upload`);
      return this.uploadToCloudinary(file, filename);
    } else {
      // Upload local (fallback)
      console.log(`🔄 Utilisation du stockage local pour l'upload`);
      return this.uploadLocal(file, filename);
    }
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    filename: string,
  ): Promise<{ url: string; filename: string }> {
    try {
      console.log(`📤 Upload vers Cloudinary: ${filename} (${file.size} bytes)`);
      
      // Utiliser upload_buffer qui est plus fiable que stream pour les buffers
      const publicId = `dayang-transport/${filename.replace(/\.[^/.]+$/, '')}`;
      
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'dayang-transport',
          public_id: filename.replace(/\.[^/.]+$/, ''), // Enlever l'extension
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
          overwrite: false,
          invalidate: true,
        },
      );

      if (!result || !result.secure_url) {
        console.error('❌ Erreur Cloudinary: résultat invalide', result);
        throw new BadRequestException('Erreur lors de l\'upload Cloudinary: résultat invalide');
      }

      console.log(`✅ Upload réussi vers Cloudinary: ${result.secure_url}`);
      console.log(`📁 Public ID: ${result.public_id}`);
      console.log(`📂 Dossier: dayang-transport/`);

      return {
        url: result.secure_url, // URL HTTPS
        filename: result.public_id,
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload Cloudinary:', error);
      throw new BadRequestException(
        `Erreur lors de l'upload Cloudinary: ${error.message || 'Erreur inconnue'}`,
      );
    }
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

  // Méthodes pour gérer les images de profil admin
  async uploadProfileImage(adminId: string, file: Express.Multer.File): Promise<{ url: string }> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    // Supprimer l'ancienne image si elle existe
    if (admin.profile_image_url) {
      await this.deleteImage(admin.profile_image_url);
    }

    // Uploader la nouvelle image
    const uploadResult = await this.saveFile(file);
    
    // Mettre à jour l'admin avec la nouvelle URL
    admin.profile_image_url = uploadResult.url;
    await this.adminRepository.save(admin);

    return { url: uploadResult.url };
  }

  async getProfileImage(adminId: string): Promise<{ url: string | null }> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    return { url: admin.profile_image_url || null };
  }

  async deleteProfileImage(adminId: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    if (admin.profile_image_url) {
      await this.deleteImage(admin.profile_image_url);
      admin.profile_image_url = null;
      await this.adminRepository.save(admin);
    }
  }

  private async deleteImage(imageUrl: string): Promise<void> {
    if (this.useCloudinary && imageUrl.includes('cloudinary.com')) {
      try {
        // Extraire le public_id de l'URL Cloudinary
        const urlParts = imageUrl.split('/');
        const publicIdIndex = urlParts.findIndex(part => part === 'upload') + 1;
        if (publicIdIndex > 0 && publicIdIndex < urlParts.length) {
          const publicId = urlParts.slice(publicIdIndex).join('/').replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
          console.log(`🗑️  Image Cloudinary supprimée: ${publicId}`);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression Cloudinary:', error);
        // Ne pas bloquer si la suppression échoue
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Supprimer le fichier local
      try {
        const filename = path.basename(imageUrl);
        const filepath = path.join(this.uploadPath, filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log(`🗑️  Fichier local supprimé: ${filepath}`);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression locale:', error);
        // Ne pas bloquer si la suppression échoue
      }
    }
  }
}
