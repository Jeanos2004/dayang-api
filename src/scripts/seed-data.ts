import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Admin } from '../auth/entities/admin.entity';
import { Post, PostStatus } from '../posts/entities/post.entity';
import { Page } from '../pages/entities/page.entity';
import { Message } from '../messages/entities/message.entity';
import { Setting } from '../settings/entities/setting.entity';

dotenv.config();

async function seedData() {
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
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    dataSource = new DataSource({
      type: 'better-sqlite3',
      database: configService.get('DB_DATABASE', 'database.sqlite'),
      entities: [Admin, Post, Page, Message, Setting],
      synchronize: false,
    });
  }

  await dataSource.initialize();

  console.log('🌱 Démarrage du seed de données...\n');

  // Seed Admin
  const adminRepository = dataSource.getRepository(Admin);
  const adminEmail = configService.get('ADMIN_EMAIL', 'admin@example.com');
  const adminPassword = configService.get('ADMIN_PASSWORD', 'changeme123');

  let admin = await adminRepository.findOne({ where: { email: adminEmail } });
  if (!admin) {
    const hashedPassword = await Admin.hashPassword(adminPassword);
    admin = adminRepository.create({
      email: adminEmail,
      password: hashedPassword,
    });
    admin = await adminRepository.save(admin);
    console.log(`✅ Admin créé: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin existe déjà: ${adminEmail}`);
  }

  // Seed Posts
  const postRepository = dataSource.getRepository(Post);
  const existingPosts = await postRepository.count();
  
  if (existingPosts === 0) {
    const posts = [
      {
        title_fr: 'Nouveau service de transport express',
        title_en: 'New express transport service',
        title_es: 'Nuevo servicio de transporte express',
        content_fr: 'Nous sommes fiers d\'annoncer le lancement de notre nouveau service de transport express entre la Chine et l\'Europe. Délais réduits, suivi en temps réel et garantie de livraison.',
        content_en: 'We are proud to announce the launch of our new express transport service between China and Europe. Reduced delivery times, real-time tracking and delivery guarantee.',
        content_es: 'Nos enorgullece anunciar el lanzamiento de nuestro nuevo servicio de transporte express entre China y Europa. Tiempos de entrega reducidos, seguimiento en tiempo real y garantía de entrega.',
        image: 'https://images.unsplash.com/photo-1601581875036-c75eb341dbe6?w=800',
        show_in_carousel: true,
        status: PostStatus.PUBLISHED,
      },
      {
        title_fr: 'Extension de nos services au Cameroun',
        title_en: 'Extension of our services to Cameroon',
        title_es: 'Extensión de nuestros servicios a Camerún',
        content_fr: 'Dayang Transport étend maintenant ses services au Cameroun. Nous offrons des solutions logistiques complètes pour vos envois vers et depuis le Cameroun.',
        content_en: 'Dayang Transport now extends its services to Cameroon. We offer comprehensive logistics solutions for your shipments to and from Cameroon.',
        content_es: 'Dayang Transport ahora extiende sus servicios a Camerún. Ofrecemos soluciones logísticas completas para sus envíos hacia y desde Camerún.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        show_in_carousel: true,
        status: PostStatus.PUBLISHED,
      },
      {
        title_fr: 'Nouveau partenariat avec les douanes européennes',
        title_en: 'New partnership with European customs',
        title_es: 'Nueva asociación con aduanas europeas',
        content_fr: 'Grâce à notre nouveau partenariat, nous garantissons un dédouanement rapide et efficace pour tous vos envois vers l\'Europe. Réduction des délais et simplification des procédures.',
        content_en: 'Thanks to our new partnership, we guarantee fast and efficient customs clearance for all your shipments to Europe. Reduced delays and simplified procedures.',
        content_es: 'Gracias a nuestra nueva asociación, garantizamos un despacho aduanero rápido y eficiente para todos sus envíos a Europa. Retrasos reducidos y procedimientos simplificados.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        show_in_carousel: false,
        status: PostStatus.PUBLISHED,
      },
      {
        title_fr: 'Amélioration de notre système de suivi',
        title_en: 'Improvement of our tracking system',
        title_es: 'Mejora de nuestro sistema de seguimiento',
        content_fr: 'Nous avons amélioré notre système de suivi en temps réel. Consultez maintenant l\'emplacement exact de votre colis à tout moment, avec des mises à jour toutes les heures.',
        content_en: 'We have improved our real-time tracking system. Now check the exact location of your package at any time, with hourly updates.',
        content_es: 'Hemos mejorado nuestro sistema de seguimiento en tiempo real. Ahora consulte la ubicación exacta de su paquete en cualquier momento, con actualizaciones cada hora.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
        show_in_carousel: false,
        status: PostStatus.DRAFT,
      },
    ];

    for (const postData of posts) {
      const post = postRepository.create(postData);
      await postRepository.save(post);
    }
    console.log(`✅ ${posts.length} publications créées`);
  } else {
    console.log(`ℹ️  ${existingPosts} publication(s) existent déjà`);
  }

  // Seed Pages
  const pageRepository = dataSource.getRepository(Page);
  const pages = [
    {
      slug: 'home',
      content_fr: 'Bienvenue chez Dayang Transport, votre partenaire de confiance pour le transport de colis et marchandises entre la Chine, l\'Europe et le Cameroun. Nous offrons des solutions logistiques complètes avec un service de qualité.',
      content_en: 'Welcome to Dayang Transport, your trusted partner for parcel and freight transport between China, Europe and Cameroon. We offer comprehensive logistics solutions with quality service.',
      content_es: 'Bienvenido a Dayang Transport, su socio de confianza para el transporte de paquetes y mercancías entre China, Europa y Camerún. Ofrecemos soluciones logísticas completas con un servicio de calidad.',
      image: 'https://images.unsplash.com/photo-1601581875036-c75eb341dbe6?w=1200',
    },
    {
      slug: 'about',
      content_fr: 'Dayang Transport est une entreprise spécialisée dans le transport international de colis et marchandises. Avec plus de 10 ans d\'expérience, nous avons développé un réseau fiable entre la Chine, l\'Europe et le Cameroun.',
      content_en: 'Dayang Transport is a company specialized in international transport of parcels and goods. With more than 10 years of experience, we have developed a reliable network between China, Europe and Cameroon.',
      content_es: 'Dayang Transport es una empresa especializada en el transporte internacional de paquetes y mercancías. Con más de 10 años de experiencia, hemos desarrollado una red confiable entre China, Europa y Camerún.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    },
    {
      slug: 'services',
      content_fr: 'Nous proposons une gamme complète de services : transport express, transport standard, dédouanement, emballage sécurisé, assurance transport et suivi en temps réel. Contactez-nous pour un devis personnalisé.',
      content_en: 'We offer a full range of services: express transport, standard transport, customs clearance, secure packaging, transport insurance and real-time tracking. Contact us for a personalized quote.',
      content_es: 'Ofrecemos una gama completa de servicios: transporte express, transporte estándar, despacho aduanero, embalaje seguro, seguro de transporte y seguimiento en tiempo real. Contáctenos para un presupuesto personalizado.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200',
    },
    {
      slug: 'contact',
      content_fr: 'Pour toute question ou demande de devis, n\'hésitez pas à nous contacter. Notre équipe est disponible pour vous accompagner dans vos projets de transport.',
      content_en: 'For any questions or quote requests, do not hesitate to contact us. Our team is available to assist you with your transport projects.',
      content_es: 'Para cualquier pregunta o solicitud de presupuesto, no dude en contactarnos. Nuestro equipo está disponible para ayudarlo con sus proyectos de transporte.',
      image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200',
    },
  ];

  for (const pageData of pages) {
    let page = await pageRepository.findOne({ where: { slug: pageData.slug } });
    if (!page) {
      page = pageRepository.create(pageData);
      await pageRepository.save(page);
      console.log(`✅ Page "${pageData.slug}" créée`);
    } else {
      console.log(`ℹ️  Page "${pageData.slug}" existe déjà`);
    }
  }

  // Seed Messages (avec téléphone)
  const messageRepository = dataSource.getRepository(Message);
  const existingMessages = await messageRepository.count();

  if (existingMessages === 0) {
    const messages = [
      {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        telephone: '+33 6 12 34 56 78',
        message: 'Bonjour, je souhaiterais obtenir des informations sur vos tarifs pour un envoi de 50kg de Chine vers la France. Merci.',
        is_read: false,
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        telephone: '+34 612 345 678',
        message: 'Hola, necesito información sobre el transporte de mercancías desde España a Camerún. ¿Cuáles son los tiempos de entrega?',
        is_read: true,
      },
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        telephone: null, // Exemple de message sans téléphone
        message: 'Hello, I would like to know if you offer insurance for valuable goods transport from China to UK.',
        is_read: false,
      },
    ];

    for (const messageData of messages) {
      const message = messageRepository.create(messageData);
      await messageRepository.save(message);
    }
    console.log(`✅ ${messages.length} messages créés`);
  } else {
    console.log(`ℹ️  ${existingMessages} message(s) existent déjà`);
  }

  // Seed Settings
  const settingRepository = dataSource.getRepository(Setting);
  const existingSettings = await settingRepository.find({
    order: { created_at: 'DESC' },
    take: 1,
  });

  if (existingSettings.length === 0) {
    const settings = settingRepository.create({
      site_name: 'Dayang Transport',
      logo: 'https://images.unsplash.com/photo-1601581875036-c75eb341dbe6?w=200',
      email: 'contact@dayang.com',
      phone: '+33 1 23 45 67 89',
      social_links: {
        facebook: 'https://facebook.com/dayang',
        twitter: 'https://twitter.com/dayang',
        linkedin: 'https://linkedin.com/company/dayang',
        instagram: 'https://instagram.com/dayang',
      },
    });
    await settingRepository.save(settings);
    console.log('✅ Paramètres créés');
  } else {
    console.log('ℹ️  Paramètres existent déjà');
  }

  await dataSource.destroy();
  console.log('\n✅ Seed terminé avec succès !');
}

seedData().catch((error) => {
  console.error('❌ Erreur lors du seed:', error);
  process.exit(1);
});
