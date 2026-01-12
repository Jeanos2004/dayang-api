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
        // Support de DATABASE_URL (Railway utilise parfois ce format)
        // Railway résout automatiquement ${{ Postgres.DATABASE_URL }} en vraie URL
        let databaseUrl = configService.get('DATABASE_URL') || process.env.DATABASE_URL;
        
        // Ignorer si DATABASE_URL contient encore la référence Railway non résolue
        if (databaseUrl && databaseUrl.includes('${{')) {
          console.warn('⚠️  DATABASE_URL contient une référence Railway non résolue, ignorée');
          databaseUrl = null;
        }
        
        // Support des variables PostgreSQL séparées
        let pgHost = configService.get('PGHOST');
        const pgUser = configService.get('PGUSER');
        const pgPassword = configService.get('PGPASSWORD');
        const pgDatabase = configService.get('PGDATABASE');
        const pgPort = configService.get('PGPORT', '5432');
        
        // Parser DATABASE_URL si disponible (format: postgresql://user:password@host:port/database)
        if (databaseUrl && databaseUrl.startsWith('postgres')) {
          try {
            const url = new URL(databaseUrl);
            const parsedHost = url.hostname;
            const parsedUser = url.username;
            const parsedPassword = url.password;
            const parsedPort = url.port || '5432';
            const parsedDatabase = url.pathname.slice(1); // Enlever le / au début
            
            // Vérifier si le host est invalide (pointant vers le service web)
            const isInvalidDbUrlHost = parsedHost.includes('web.railway.internal') || parsedHost.includes('localhost');
            
            if (isInvalidDbUrlHost) {
              console.warn('⚠️  DATABASE_URL pointe vers le service web (web.railway.internal), pas PostgreSQL !');
              console.warn('⚠️  DATABASE_URL Host: ' + parsedHost);
              console.warn('⚠️  Vérifiez que la DATABASE_URL pointe vers le service PostgreSQL, pas le service web');
              console.warn('⚠️  Utilisation de SQLite en fallback');
              // Ne pas retourner, continuer vers le fallback SQLite
            } else {
              console.log('📊 DATABASE_URL détectée, parsing...');
              
              const config = {
                type: 'postgres' as const,
                host: parsedHost,
                port: parseInt(parsedPort, 10),
                username: parsedUser,
                password: parsedPassword,
                database: parsedDatabase,
                entities: [Admin, Post, Page, Message, Setting],
                synchronize: true,
                logging: configService.get('NODE_ENV') === 'development',
                ssl: {
                  rejectUnauthorized: false,
                },
                retryAttempts: 10,
                retryDelay: 3000,
                connectTimeoutMS: 10000,
              };
              
              console.log('📊 Configuration PostgreSQL (depuis DATABASE_URL):');
              console.log(`   Host: ${parsedHost}`);
              console.log(`   Port: ${config.port}`);
              console.log(`   Database: ${parsedDatabase}`);
              console.log(`   Username: ${parsedUser}`);
              
              return config as any;
            }
          } catch (error) {
            console.error('❌ Erreur lors du parsing de DATABASE_URL:', error);
          }
        }
        
        // Vérifier que TOUTES les variables PostgreSQL sont présentes ET que le host n'est pas le service web lui-même
        const hasAllPgVars = !!(pgHost && pgUser && pgPassword && pgDatabase);
        const isInvalidHost = pgHost && (pgHost.includes('web.railway.internal') || pgHost.includes('localhost'));
        
        // Détecter le host invalide EN PREMIER
        if (isInvalidHost) {
          console.warn('⚠️  PGHOST pointe vers le service web (web.railway.internal), pas PostgreSQL !');
          console.warn('⚠️  Vérifiez que PostgreSQL est correctement lié au service web dans Railway');
          console.warn('⚠️  Utilisation de SQLite en fallback (les données seront perdues à chaque déploiement)');
          console.warn('⚠️  Pour utiliser PostgreSQL, utilisez DATABASE_URL ou vérifiez que PostgreSQL est lié correctement');
          // Fallback vers SQLite
          return {
            type: 'better-sqlite3' as const,
            database: configService.get('DB_DATABASE', 'database.sqlite'),
            entities: [Admin, Post, Page, Message, Setting],
            synchronize: true,
            logging: configService.get('NODE_ENV') === 'development',
          };
        } else if (hasAllPgVars) {
          // PostgreSQL (production sur Railway)
          const config = {
            type: 'postgres' as const,
            host: pgHost,
            port: parseInt(pgPort, 10),
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
