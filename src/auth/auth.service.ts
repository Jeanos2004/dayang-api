import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

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
}
