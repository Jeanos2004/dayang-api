import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
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

  describe('Auth', () => {
    it('/api/auth/login (POST) - should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'changeme123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      authToken = response.body.access_token;
    });

    it('/api/auth/login (POST) - should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Posts (Public)', () => {
    it('/api/posts (GET) - should return list of posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/api/posts/carousel (GET) - should return carousel posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts/carousel')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Posts (Protected)', () => {
    it('/api/posts (POST) - should create post with valid token', async () => {
      if (!authToken) {
        const loginResponse = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'admin@example.com',
            password: 'changeme123',
          });
        authToken = loginResponse.body.access_token;
      }

      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title_fr: 'Test FR',
          title_en: 'Test EN',
          title_es: 'Test ES',
          content_fr: 'Content FR',
          content_en: 'Content EN',
          content_es: 'Content ES',
          status: 'published',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title_fr).toBe('Test FR');
    });

    it('/api/posts (POST) - should fail without token', async () => {
      await request(app.getHttpServer())
        .post('/api/posts')
        .send({
          title_fr: 'Test',
          title_en: 'Test',
          title_es: 'Test',
          content_fr: 'Content',
          content_en: 'Content',
          content_es: 'Content',
        })
        .expect(401);
    });
  });

  describe('Settings', () => {
    it('/api/settings (GET) - should return settings', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/settings')
        .expect(200);

      expect(response.body).toHaveProperty('site_name');
    });
  });

  describe('Pages', () => {
    it('/api/pages/home (GET) - should return home page', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pages/home')
        .expect(200);

      expect(response.body).toHaveProperty('slug', 'home');
    });

    it('/api/pages/invalid (GET) - should fail with invalid slug', async () => {
      await request(app.getHttpServer())
        .get('/api/pages/invalid')
        .expect(400);
    });
  });
});
