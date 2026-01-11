import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsResponseDto } from './dto/settings-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Récupérer les paramètres du site' })
  @ApiResponse({
    status: 200,
    description: 'Paramètres du site (nom, logo, contacts, réseaux sociaux)',
    type: SettingsResponseDto,
  })
  async findOne() {
    return this.settingsService.findOne();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier les paramètres du site (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Paramètres modifiés avec succès',
    type: SettingsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async update(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.update(updateSettingsDto);
  }
}
