import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../auth/entities/admin.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
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
      entities: [Admin],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: configService.get('DB_DATABASE', 'database.sqlite'),
      entities: [Admin],
      synchronize: false,
    });
  }

  await dataSource.initialize();

  const adminRepository = dataSource.getRepository(Admin);

  const adminEmail = configService.get('ADMIN_EMAIL', 'admin@example.com');
  const adminPassword = configService.get('ADMIN_PASSWORD', 'changeme123');

  const existingAdmin = await adminRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin avec l'email ${adminEmail} existe déjà`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await Admin.hashPassword(adminPassword);
  const admin = adminRepository.create({
    email: adminEmail,
    password: hashedPassword,
  });

  await adminRepository.save(admin);
  console.log(`✅ Admin créé avec succès: ${adminEmail}`);

  await dataSource.destroy();
}

seedAdmin().catch((error) => {
  console.error('❌ Erreur lors du seed:', error);
  process.exit(1);
});
