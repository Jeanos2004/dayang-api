import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { VALID_SLUGS } from './constants/valid-slugs.constant';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async findAll(): Promise<Page[]> {
    return this.pagesRepository.find({
      order: { updated_at: 'DESC' },
    });
  }

  async create(createPageDto: CreatePageDto): Promise<Page> {
    // Vérifier que le slug est valide
    if (!VALID_SLUGS.includes(createPageDto.slug as any)) {
      throw new BadRequestException(`Le slug doit être un des suivants: ${VALID_SLUGS.join(', ')}`);
    }

    // Vérifier si la page existe déjà
    const existingPage = await this.pagesRepository.findOne({
      where: { slug: createPageDto.slug },
    });

    if (existingPage) {
      throw new ConflictException(`Une page avec le slug "${createPageDto.slug}" existe déjà`);
    }

    const page = this.pagesRepository.create(createPageDto);
    return this.pagesRepository.save(page);
  }

  async findBySlug(slug: string): Promise<Page> {
    if (!VALID_SLUGS.includes(slug as any)) {
      throw new BadRequestException(
        `Slug invalide. Slugs autorisés: ${VALID_SLUGS.join(', ')}`,
      );
    }

    let page = await this.pagesRepository.findOne({ where: { slug } });

    if (!page) {
      // Créer la page si elle n'existe pas
      page = this.pagesRepository.create({ slug });
      page = await this.pagesRepository.save(page);
    }

    return page;
  }

  async update(slug: string, updatePageDto: UpdatePageDto): Promise<Page> {
    if (!VALID_SLUGS.includes(slug as any)) {
      throw new BadRequestException(
        `Slug invalide. Slugs autorisés: ${VALID_SLUGS.join(', ')}`,
      );
    }

    const page = await this.findBySlug(slug);
    Object.assign(page, updatePageDto);
    return this.pagesRepository.save(page);
  }

  async remove(slug: string): Promise<void> {
    if (!VALID_SLUGS.includes(slug as any)) {
      throw new BadRequestException(
        `Slug invalide. Slugs autorisés: ${VALID_SLUGS.join(', ')}`,
      );
    }

    const page = await this.pagesRepository.findOne({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`Page avec le slug "${slug}" non trouvée`);
    }

    await this.pagesRepository.remove(page);
  }
}
