import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageResponseDto } from './dto/page-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

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
  async update(@Param('slug') slug: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(slug, updatePageDto);
  }
}
