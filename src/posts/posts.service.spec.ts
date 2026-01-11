import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post, PostStatus } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title_fr: 'Test FR',
        title_en: 'Test EN',
        title_es: 'Test ES',
        content_fr: 'Content FR',
        content_en: 'Content EN',
        content_es: 'Content ES',
        status: PostStatus.DRAFT,
      };

      const mockPost = {
        id: 'uuid-123',
        ...createPostDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(mockPost);
      mockRepository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto);

      expect(result).toEqual(mockPost);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const mockPost = {
        id: 'uuid-123',
        title_fr: 'Test',
        status: PostStatus.PUBLISHED,
      };

      mockRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne('uuid-123');

      expect(result).toEqual(mockPost);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findCarousel', () => {
    it('should return published posts with carousel flag', async () => {
      const mockPosts = [
        {
          id: 'uuid-1',
          title_fr: 'Post 1',
          show_in_carousel: true,
          status: PostStatus.PUBLISHED,
        },
      ];

      mockRepository.find.mockResolvedValue(mockPosts);

      const result = await service.findCarousel();

      expect(result).toEqual(mockPosts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          show_in_carousel: true,
          status: PostStatus.PUBLISHED,
        },
        order: { created_at: 'DESC' },
      });
    });
  });
});
