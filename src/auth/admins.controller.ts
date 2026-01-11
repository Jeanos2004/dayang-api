import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer un nouvel administrateur (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Administrateur créé avec succès',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 409, description: 'Un administrateur avec cet email existe déjà' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.authService.createAdmin(createAdminDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Liste de tous les administrateurs (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Liste des administrateurs',
    type: [AdminResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async findAll(): Promise<AdminResponseDto[]> {
    return this.authService.findAllAdmins();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Détails d\'un administrateur (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de l\'administrateur (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Détails de l\'administrateur',
    type: AdminResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.authService.findOneAdmin(id);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer un administrateur (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de l\'administrateur (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Administrateur supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Administrateur supprimé avec succès',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Administrateur non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async remove(@Param('id') id: string) {
    await this.authService.removeAdmin(id);
    return { message: 'Administrateur supprimé avec succès' };
  }
}
