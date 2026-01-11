import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { UpdatePageDto } from './dto/update-page.dto';

const ALLOWED_SLUGS = ['home', 'about', 'services', 'contact'];

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  async findBySlug(slug: string): Promise<Page> {
    if (!ALLOWED_SLUGS.includes(slug)) {
      throw new BadRequestException(
        `Slug invalide. Slugs autorisés: ${ALLOWED_SLUGS.join(', ')}`,
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
    const page = await this.findBySlug(slug);
    Object.assign(page, updatePageDto);
    return this.pagesRepository.save(page);
  }
}
