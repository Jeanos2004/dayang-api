import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await admin.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { email: admin.email, sub: admin.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async validateUser(userId: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: userId },
    });

    if (!admin) {
      throw new UnauthorizedException();
    }

    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Un administrateur avec cet email existe déjà');
    }

    const hashedPassword = await Admin.hashPassword(createAdminDto.password);
    const admin = this.adminRepository.create({
      email: createAdminDto.email,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    
    // Retourner sans le mot de passe
    const { password, ...adminWithoutPassword } = savedAdmin;
    // S'assurer que profile_image_url est null au lieu de undefined
    return {
      ...adminWithoutPassword,
      profile_image_url: adminWithoutPassword.profile_image_url ?? null,
    };
  }

  async findAllAdmins() {
    const admins = await this.adminRepository.find({
      order: { created_at: 'DESC' },
    });
    
    // Retourner sans les mots de passe et s'assurer que profile_image_url est null au lieu de undefined
    return admins.map(({ password, ...adminWithoutPassword }) => ({
      ...adminWithoutPassword,
      profile_image_url: adminWithoutPassword.profile_image_url ?? null,
    }));
  }

  async findOneAdmin(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} non trouvé`);
    }

    const { password, ...adminWithoutPassword } = admin;
    // S'assurer que profile_image_url est null au lieu de undefined
    return {
      ...adminWithoutPassword,
      profile_image_url: adminWithoutPassword.profile_image_url ?? null,
    };
  }

  async removeAdmin(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} non trouvé`);
    }

    await this.adminRepository.remove(admin);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    // Pour la sécurité, on ne révèle pas si l'email existe ou non
    if (!admin) {
      // Retourner un message générique même si l'email n'existe pas
      return {
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      };
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expire dans 1 heure

    // Sauvegarder le token dans la base de données
    admin.reset_password_token = resetToken;
    admin.reset_password_expires = resetTokenExpires;
    await this.adminRepository.save(admin);

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // Pour l'instant, on log le token (développement uniquement)
    console.log(`🔑 Token de réinitialisation pour ${admin.email}: ${resetToken}`);
    console.log(`📧 Lien: http://votre-frontend.com/reset-password?token=${resetToken}`);

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      // En développement, on peut retourner le token (à retirer en production)
      // token: resetToken, // À retirer en production
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: { reset_password_token: resetPasswordDto.token },
    });

    if (!admin) {
      throw new BadRequestException('Token de réinitialisation invalide ou expiré');
    }

    // Vérifier si le token n'a pas expiré
    if (!admin.reset_password_expires || admin.reset_password_expires < new Date()) {
      throw new BadRequestException('Token de réinitialisation expiré');
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await Admin.hashPassword(resetPasswordDto.newPassword);

    // Mettre à jour le mot de passe et effacer le token
    admin.password = hashedPassword;
    admin.reset_password_token = null;
    admin.reset_password_expires = null;
    await this.adminRepository.save(admin);

    return {
      message: 'Mot de passe réinitialisé avec succès',
    };
  }
}
