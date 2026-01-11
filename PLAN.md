# 📋 PLAN D'IMPLÉMENTATION - Backend Site Vitrine Transport

## 🎯 Objectif
Créer une API REST complète pour un site vitrine multilingue (FR/EN/ES) avec dashboard admin en 2 heures.

---

## ⏱️ PHASE 1 : Configuration & Setup (15 min)

### 1.1 Dépendances à installer
- [ ] `@nestjs/config` - Gestion des variables d'environnement
- [ ] `@nestjs/typeorm` + `typeorm` - ORM pour base de données
- [ ] `@nestjs/jwt` + `@nestjs/passport` + `passport` + `passport-jwt` - Authentification JWT
- [ ] `bcrypt` + `@types/bcrypt` - Hashage des mots de passe
- [ ] `class-validator` + `class-transformer` - Validation des données
- [ ] `pg` ou `mysql2` - Driver base de données (PostgreSQL recommandé)
- [ ] `multer` + `@types/multer` - Upload de fichiers
- [ ] `@nestjs/serve-static` - Servir les fichiers statiques (images)

### 1.2 Configuration
- [ ] Créer fichier `.env` avec variables nécessaires
- [ ] Configurer TypeORM dans `app.module.ts`
- [ ] Configurer JWT dans module auth
- [ ] Configurer CORS
- [ ] Configurer ValidationPipe global

---

## ⏱️ PHASE 2 : Base de données & Entités (20 min)

### 2.1 Créer les entités TypeORM
- [ ] `Admin` (id, email, password, created_at)
- [ ] `Post` (id, title_fr/en/es, content_fr/en/es, image, show_in_carousel, status, created_at)
- [ ] `Page` (id, slug, content_fr/en/es, image, updated_at)
- [ ] `Message` (id, name, email, message, is_read, created_at)
- [ ] `Setting` (id, site_name, logo, email, phone, social_links)

### 2.2 Migrations
- [ ] Générer migrations pour toutes les tables
- [ ] Ajouter index sur slug (pages), email (admins, messages)

---

## ⏱️ PHASE 3 : Authentification (20 min)

### 3.1 Module Auth
- [ ] Créer `AuthModule`
- [ ] Créer `AuthService` (login, validateUser, hashPassword)
- [ ] Créer `AuthController` (POST /api/auth/login)
- [ ] Créer `JwtStrategy` (Passport)
- [ ] Créer Guard `JwtAuthGuard`
- [ ] Créer DTOs (LoginDto, AuthResponseDto)

### 3.2 Séed Admin initial
- [ ] Script pour créer un admin par défaut (email/password dans .env)

---

## ⏱️ PHASE 4 : Module Posts (15 min)

### 4.1 Posts Module
- [ ] Créer `PostsModule`, `PostsService`, `PostsController`
- [ ] Endpoints publics :
  - GET /api/posts (liste avec filtres)
  - GET /api/posts/:id
  - GET /api/posts/carousel (show_in_carousel=true + published)
- [ ] Endpoints admin (protégés) :
  - POST /api/posts
  - PUT /api/posts/:id
  - DELETE /api/posts/:id
- [ ] DTOs (CreatePostDto, UpdatePostDto)
- [ ] Validation des champs multilingues

---

## ⏱️ PHASE 5 : Module Pages (10 min)

### 5.1 Pages Module
- [ ] Créer `PagesModule`, `PagesService`, `PagesController`
- [ ] Endpoints :
  - GET /api/pages/:slug (public)
  - PUT /api/pages/:slug (admin protégé)
- [ ] DTOs (UpdatePageDto)
- [ ] Gestion des slugs prédéfinis (home, about, services, contact)

---

## ⏱️ PHASE 6 : Module Contact/Messages (10 min)

### 6.1 Messages Module
- [ ] Créer `MessagesModule`, `MessagesService`, `MessagesController`
- [ ] Endpoints :
  - POST /api/contact (public)
  - GET /api/messages (admin protégé)
  - PUT /api/messages/:id/read (admin protégé)
- [ ] DTOs (CreateMessageDto, UpdateMessageDto)
- [ ] Validation email

---

## ⏱️ PHASE 7 : Module Settings (10 min)

### 7.1 Settings Module
- [ ] Créer `SettingsModule`, `SettingsService`, `SettingsController`
- [ ] Endpoints :
  - GET /api/settings (public)
  - PUT /api/settings (admin protégé)
- [ ] DTOs (UpdateSettingsDto)
- [ ] Gestion JSON pour social_links

---

## ⏱️ PHASE 8 : Upload d'images (15 min)

### 8.1 Upload Module
- [ ] Configurer Multer
- [ ] Créer service d'upload (stockage local ou Cloudinary)
- [ ] Endpoint POST /api/upload (admin protégé)
- [ ] Validation type/image taille
- [ ] Générer URLs des images

---

## ⏱️ PHASE 9 : Finalisation & Tests (15 min)

### 9.1 Structure finale
- [ ] Organiser modules dans `app.module.ts`
- [ ] Configurer routes globales (/api)
- [ ] Gestion erreurs global (ExceptionFilter)
- [ ] Documentation Swagger (optionnel mais recommandé)

### 9.2 Tests rapides
- [ ] Tester connexion DB
- [ ] Tester login admin
- [ ] Tester création post
- [ ] Tester endpoint public posts

---

## 📁 Structure des dossiers proposée

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── auth-response.dto.ts
├── posts/
│   ├── posts.module.ts
│   ├── posts.service.ts
│   ├── posts.controller.ts
│   ├── entities/
│   │   └── post.entity.ts
│   └── dto/
│       ├── create-post.dto.ts
│       └── update-post.dto.ts
├── pages/
│   ├── pages.module.ts
│   ├── pages.service.ts
│   ├── pages.controller.ts
│   ├── entities/
│   │   └── page.entity.ts
│   └── dto/
│       └── update-page.dto.ts
├── messages/
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   ├── entities/
│   │   └── message.entity.ts
│   └── dto/
│       ├── create-message.dto.ts
│       └── update-message.dto.ts
├── settings/
│   ├── settings.module.ts
│   ├── settings.service.ts
│   ├── settings.controller.ts
│   ├── entities/
│   │   └── setting.entity.ts
│   └── dto/
│       └── update-settings.dto.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.service.ts
│   └── upload.controller.ts
├── common/
│   ├── entities/
│   │   └── base.entity.ts (id, timestamps)
│   └── guards/
│       └── jwt-auth.guard.ts
├── config/
│   └── database.config.ts
└── app.module.ts
```

---

## 🔐 Variables d'environnement (.env)

```env
# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=dayang_db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Admin par défaut
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123

# Server
PORT=3000
NODE_ENV=development

# Upload
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=5242880
```

---

## ✅ Checklist finale

- [ ] Toutes les entités créées
- [ ] Toutes les migrations appliquées
- [ ] Tous les modules fonctionnels
- [ ] Authentification JWT opérationnelle
- [ ] Routes publiques accessibles
- [ ] Routes admin protégées
- [ ] Upload images fonctionnel
- [ ] Validation des données
- [ ] CORS configuré
- [ ] README mis à jour
- [ ] .env.example créé

---

## 🚀 Ordre d'implémentation recommandé

1. **Configuration & DB** → Setup base + entités
2. **Auth** → Pour protéger les routes admin
3. **Posts** → Module principal
4. **Pages** → Simple CRUD
5. **Messages** → Simple CRUD
6. **Settings** → Simple CRUD
7. **Upload** → Pour les images
8. **Tests & Polish** → Finalisation

---

**Temps total estimé : ~2 heures**
