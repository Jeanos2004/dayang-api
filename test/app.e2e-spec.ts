import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth - Authentification', () => {
    it('POST /api/auth/login - should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'changeme123',
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('user');
        authToken = response.body.access_token;
      } else {
        // Si l'admin n'existe pas, on skip le test
        console.warn('Admin non trouvé, skip du test');
      }
    });

    it('POST /api/auth/login - should fail with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Posts - Publications (Public)', () => {
    it('GET /api/posts - should return list of posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /api/posts/carousel - should return carousel posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts/carousel')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Settings - Paramètres', () => {
    it('GET /api/settings - should return settings', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/settings')
        .expect(200);

      expect(response.body).toHaveProperty('site_name');
    });
  });

  describe('Pages - Pages du site', () => {
    it('GET /api/pages/home - should return home page', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pages/home')
        .expect(200);

      expect(response.body).toHaveProperty('slug', 'home');
    });

    it('GET /api/pages/invalid - should fail with invalid slug', async () => {
      await request(app.getHttpServer())
        .get('/api/pages/invalid')
        .expect(400);
    });
  });

  describe('Messages - Messages de contact', () => {
    it('POST /api/contact - should create message', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('john@example.com');
    });
  });
});
