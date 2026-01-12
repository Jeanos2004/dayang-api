import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Admin } from '../auth/entities/admin.entity';
import { Post } from '../posts/entities/post.entity';
import { Page } from '../pages/entities/page.entity';
import { Message } from '../messages/entities/message.entity';
import { Setting } from '../settings/entities/setting.entity';

dotenv.config();

async function initDatabase() {
  const configService = new ConfigService();

  // Détecter PostgreSQL ou SQLite
  const pgHost = configService.get('PGHOST');
  let dataSource: DataSource;
  
  if (pgHost) {
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
  } else {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: configService.get('DB_DATABASE', 'database.sqlite'),
      entities: [Admin, Post, Page, Message, Setting],
      synchronize: true,
    });
  }

  try {
    await dataSource.initialize();
    console.log('✅ Base de données initialisée avec succès');
    
    // Vérifier si l'admin existe
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
    } else {
      console.log(`ℹ️  Admin existe déjà: ${adminEmail}`);
    }

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

initDatabase();
