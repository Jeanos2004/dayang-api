import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepository.create(createMessageDto);
    return this.messagesRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messagesRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }
    return message;
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findOne(id);
    message.is_read = true;
    return this.messagesRepository.save(message);
  }
}
