import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<Admin>;
  let jwtService: JwtService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token on valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'admin@test.com',
        password: 'password123',
      };

      const mockAdmin = {
        id: 'uuid-123',
        email: 'admin@test.com',
        password: 'hashedPassword',
        validatePassword: jest.fn().mockResolvedValue(true),
      } as any;

      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('admin@test.com');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException on invalid email', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@test.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const loginDto: LoginDto = {
        email: 'admin@test.com',
        password: 'wrongpassword',
      };

      const mockAdmin = {
        id: 'uuid-123',
        email: 'admin@test.com',
        password: 'hashedPassword',
        validatePassword: jest.fn().mockResolvedValue(false),
      } as any;

      mockRepository.findOne.mockResolvedValue(mockAdmin);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createAdmin', () => {
    it('should create a new admin', async () => {
      const createAdminDto: CreateAdminDto = {
        email: 'newadmin@test.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({
        email: createAdminDto.email,
        password: 'hashedPassword',
      });
      mockRepository.save.mockResolvedValue({
        id: 'uuid-123',
        email: createAdminDto.email,
        password: 'hashedPassword',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.createAdmin(createAdminDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(createAdminDto.email);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createAdminDto: CreateAdminDto = {
        email: 'existing@test.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue({
        id: 'uuid-123',
        email: 'existing@test.com',
      });

      await expect(service.createAdmin(createAdminDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAllAdmins', () => {
    it('should return all admins without passwords', async () => {
      const mockAdmins = [
        {
          id: 'uuid-1',
          email: 'admin1@test.com',
          password: 'hash1',
          created_at: new Date(),
        },
        {
          id: 'uuid-2',
          email: 'admin2@test.com',
          password: 'hash2',
          created_at: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockAdmins);

      const result = await service.findAllAdmins();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
    });
  });
});
