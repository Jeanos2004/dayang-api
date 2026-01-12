import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Admin } from './auth/entities/admin.entity';
import { Post } from './posts/entities/post.entity';
import { Page } from './pages/entities/page.entity';
import { Message } from './messages/entities/message.entity';
import { Setting } from './settings/entities/setting.entity';
import { ConfigService } from '@nestjs/config';

async function initializeDatabase(app: any) {
  const configService = app.get(ConfigService);
  
  try {
    // Détecter si on utilise PostgreSQL (Railway) ou SQLite (local)
    const pgHost = configService.get('PGHOST');
    
    let dataSource: DataSource;
    
    if (pgHost) {
      // PostgreSQL (production sur Railway)
      dataSource = new DataSource({
        type: 'postgres',
        host: pgHost,
        port: configService.get('PGPORT', 5432),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: configService.get('PGDATABASE'),
        entities: [Admin, Post, Page, Message, Setting],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      console.log('📊 Utilisation de PostgreSQL');
    } else {
      // SQLite (développement local)
      dataSource = new DataSource({
        type: 'better-sqlite3',
        database: configService.get('DB_DATABASE', 'database.sqlite'),
        entities: [Admin, Post, Page, Message, Setting],
        synchronize: true,
      });
      console.log('📊 Utilisation de SQLite (local)');
    }

    await dataSource.initialize();
    console.log('✅ Base de données initialisée');

    // Créer l'admin s'il n'existe pas
    const adminRepository = dataSource.getRepository(Admin);
    const adminEmail = configService.get('ADMIN_EMAIL', 'admin@example.com');
    const adminPassword = configService.get('ADMIN_PASSWORD', 'changeme123');

    const existingAdmin = await adminRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await Admin.hashPassword(adminPassword);
      const admin = adminRepository.create({
        email: adminEmail,
        password: hashedPassword,
      });
      await adminRepository.save(admin);
      console.log(`✅ Admin créé: ${adminEmail}`);
    }

    await dataSource.destroy();
  } catch (error) {
    console.error('⚠️  Erreur lors de l\'initialisation de la base de données:', error.message);
    // Ne pas bloquer le démarrage, TypeORM va gérer la synchronisation
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Préfixe global /api
  app.setGlobalPrefix('api');

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Dayang Transport API')
    .setDescription('API REST pour le site vitrine de transport (Chine - Europe - Cameroun)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez le token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentification admin')
    .addTag('posts', 'Gestion des publications/actualités')
    .addTag('pages', 'Gestion des pages du site')
    .addTag('messages', 'Gestion des messages de contact')
    .addTag('settings', 'Paramètres du site')
    .addTag('upload', 'Upload d\'images')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Dayang Transport API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Initialiser la base de données au démarrage
  await initializeDatabase(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Documentation Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
