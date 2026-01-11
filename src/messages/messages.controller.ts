import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('messages')
@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post('contact')
  @ApiOperation({ summary: 'Envoyer un message de contact' })
  @ApiResponse({
    status: 201,
    description: 'Message envoyé avec succès',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Liste des messages (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les messages de contact',
    type: [MessageResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async findAll() {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('messages/:id/read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Marquer un message comme lu (Admin)' })
  @ApiParam({ name: 'id', description: 'ID du message (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Message marqué comme lu avec succès',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Message non trouvé' })
  @ApiResponse({ status: 401, description: 'Non autorisé - Token JWT requis' })
  async markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}
