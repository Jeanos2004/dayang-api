import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostStatus } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des publications' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PostStatus,
    description: 'Filtrer par statut (draft ou published)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des publications',
    type: [PostResponseDto],
  })
  async findAll(@Query('status') status?: PostStatus) {
    return this.postsService.findAll(status);
  }

  @Public()
  @Get('carousel')
  @ApiOperation({ summary: 'Publications pour le carousel' })
  @ApiResponse({
    status: 200,
    description: 'Liste des publications à afficher dans le carousel (show_in_carousel=true et status=published)',
    type: [PostResponseDto],
  })
  async findCarousel() {
    return this.postsService.findCarousel();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une publication' })
  @ApiParam({ name: 'id', description: 'ID de la publication (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Détails de la publication',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Publication non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une publication (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Publication créée avec succès',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier une publication (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la publication (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Publication modifiée avec succès',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Publication non trouvée' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer une publication (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la publication (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Publication supprimée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Post supprimé avec succès',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Publication non trouvée' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async remove(@Param('id') id: string) {
    await this.postsService.remove(id);
    return { message: 'Post supprimé avec succès' };
  }
}
