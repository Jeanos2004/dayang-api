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
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get('DB_DATABASE', 'database.sqlite'),
        entities: [Admin, Post, Page, Message, Setting],
        synchronize: true, // Active en production pour créer les tables automatiquement
        logging: configService.get('NODE_ENV') === 'development',
      }),
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
