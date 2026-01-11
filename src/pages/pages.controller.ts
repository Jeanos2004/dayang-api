import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageResponseDto } from './dto/page-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste de toutes les pages' })
  @ApiResponse({
    status: 200,
    description: 'Liste des pages',
    type: [PageResponseDto],
  })
  async findAll() {
    return this.pagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une nouvelle page (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Page créée avec succès',
    type: PageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Données invalides ou slug invalide' })
  @ApiResponse({ status: 409, description: 'Une page avec ce slug existe déjà' })
  async create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Récupérer une page par son slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug de la page (home, about, services, contact)',
    example: 'home',
  })
  @ApiResponse({
    status: 200,
    description: 'Contenu de la page',
    type: PageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Slug invalide' })
  @ApiResponse({ status: 404, description: 'Page non trouvée' })
  async findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier une page (Admin)' })
  @ApiParam({
    name: 'slug',
    description: 'Slug de la page (home, about, services, contact)',
    example: 'home',
  })
  @ApiResponse({
    status: 200,
    description: 'Page modifiée avec succès',
    type: PageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Données invalides ou slug invalide' })
  @ApiResponse({ status: 404, description: 'Page non trouvée' })
  async update(@Param('slug') slug: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(slug, updatePageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer une page (Admin)' })
  @ApiParam({
    name: 'slug',
    description: 'Slug de la page (home, about, services, contact)',
    example: 'home',
  })
  @ApiResponse({
    status: 204,
    description: 'Page supprimée avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Slug invalide' })
  @ApiResponse({ status: 404, description: 'Page non trouvée' })
  async remove(@Param('slug') slug: string) {
    await this.pagesService.remove(slug);
  }
}
