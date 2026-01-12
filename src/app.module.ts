import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PagesModule } from './pages/pages.module';
import { MessagesModule } from './messages/messages.module';
import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';
import { Admin } from './auth/entities/admin.entity';
import { Post } from './posts/entities/post.entity';
import { Page } from './pages/entities/page.entity';
import { Message } from './messages/entities/message.entity';
import { Setting } from './settings/entities/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Servir les fichiers statiques du dossier uploads
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uploadPath = configService.get('UPLOAD_DEST', './uploads');
        return [
          {
            rootPath: join(process.cwd(), uploadPath),
            serveRoot: '/uploads',
            serveStaticOptions: {
              index: false,
              dotfiles: 'deny',
            },
          },
        ];
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Détecter si on utilise PostgreSQL (Railway) ou SQLite (local)
        const pgHost = configService.get('PGHOST');
        const pgUser = configService.get('PGUSER');
        const pgPassword = configService.get('PGPASSWORD');
        const pgDatabase = configService.get('PGDATABASE');
        
        // Vérifier que TOUTES les variables PostgreSQL sont présentes
        const hasAllPgVars = !!(pgHost && pgUser && pgPassword && pgDatabase);
        
        if (hasAllPgVars) {
          // PostgreSQL (production sur Railway)
          const config = {
            type: 'postgres' as const,
            host: pgHost,
            port: parseInt(configService.get('PGPORT', '5432'), 10),
            username: pgUser,
            password: pgPassword,
            database: pgDatabase,
            entities: [Admin, Post, Page, Message, Setting],
            synchronize: true,
            logging: configService.get('NODE_ENV') === 'development',
            ssl: {
              rejectUnauthorized: false, // Nécessaire pour Railway PostgreSQL
            },
            retryAttempts: 10,
            retryDelay: 3000,
            connectTimeoutMS: 10000,
          };
          
          // Log de debug (sans exposer les secrets)
          console.log('📊 Configuration PostgreSQL détectée:');
          console.log(`   Host: ${pgHost}`);
          console.log(`   Port: ${config.port}`);
          console.log(`   Database: ${pgDatabase}`);
          console.log(`   Username: ${pgUser}`);
          console.log(`   ⚠️  Si vous voyez ECONNREFUSED, vérifiez que PostgreSQL est démarré et lié au service`);
          
          return config as any;
        } else {
          // SQLite (développement local ou PostgreSQL non configuré)
          console.log('📊 Configuration SQLite (fallback)');
          if (pgHost) {
            console.log('   ⚠️  PostgreSQL détecté mais variables incomplètes. Variables manquantes:');
            if (!pgHost) console.log('      - PGHOST');
            if (!pgUser) console.log('      - PGUSER');
            if (!pgPassword) console.log('      - PGPASSWORD');
            if (!pgDatabase) console.log('      - PGDATABASE');
            console.log('   ℹ️  Utilisation de SQLite temporairement');
          }
          return {
            type: 'better-sqlite3' as const,
            database: configService.get('DB_DATABASE', 'database.sqlite'),
            entities: [Admin, Post, Page, Message, Setting],
            synchronize: true,
            logging: configService.get('NODE_ENV') === 'development',
          };
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PostsModule,
    PagesModule,
    MessagesModule,
    SettingsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
