import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      status: createPostDto.status || PostStatus.DRAFT,
    });
    return this.postsRepository.save(post);
  }

  async findAll(status?: PostStatus): Promise<Post[]> {
    const where = status ? { status } : {};
    return this.postsRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findCarousel(): Promise<Post[]> {
    return this.postsRepository.find({
      where: {
        show_in_carousel: true,
        status: PostStatus.PUBLISHED,
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post avec l'ID ${id} non trouvé`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }
}
