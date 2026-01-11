# 🚚 Backend API - Site Vitrine Transport (Chine - Europe - Cameroun)

Backend REST API développé avec NestJS pour la gestion complète d'un site vitrine multilingue de transport de colis et marchandises.

## 📋 Table des matières

- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Authentification](#-authentification)
- [Base de données](#-base-de-données)
- [Démarrage](#-démarrage)
- [Tests](#-tests)

---

## 🎯 Description

API REST complète permettant la gestion dynamique d'un site vitrine multilingue (Français, Anglais, Espagnol) avec :

- 🔐 Authentification admin sécurisée (JWT)
- 📰 Gestion des publications/actualités (avec carousel)
- 📄 Gestion des pages du site (Accueil, À propos, Services, Contact)
- 💬 Réception et gestion des messages de contact
- ⚙️ Paramètres du site
- 📸 Upload d'images

---

## ✨ Fonctionnalités

### 🔑 Authentification
- Login admin avec JWT
- Routes protégées pour le dashboard admin
- Hashage sécurisé des mots de passe (bcrypt)

### 📰 Publications / News
- CRUD complet des publications
- Support multilingue (FR/EN/ES)
- Gestion du carousel de la page d'accueil
- Statut draft/published
- Upload d'images associées

### 📄 Pages du site
- Gestion dynamique du contenu des pages
- Support multilingue
- Pages prédéfinies : home, about, services, contact

### 💬 Messages de contact
- Réception des messages depuis le formulaire public
- Marquer comme lu/non lu
- Gestion depuis le dashboard admin

### ⚙️ Paramètres
- Configuration du site (nom, logo, contacts)
- Liens sociaux (JSON)
- Mise à jour depuis le dashboard

### 📸 Upload d'images
- Upload sécurisé d'images
- Validation des types et tailles
- Stockage local ou cloud

---

## 🛠 Technologies

- **Framework** : NestJS 11.x
- **Language** : TypeScript
- **Base de données** : SQLite (better-sqlite3)
- **ORM** : TypeORM
- **Authentification** : JWT (Passport)
- **Validation** : class-validator, class-transformer
- **Upload** : Multer
- **Documentation** : Swagger/OpenAPI

---

## 📦 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Git

---

## 🚀 Installation

1. **Cloner le dépôt**
```bash
git clone <repository-url>
cd dayang-backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. **Créer des données de test (recommandé)**
```bash
# Créer un admin par défaut
npm run seed:admin

# Créer des données de test complètes (posts, pages, messages, settings)
npm run seed:data
```

> Note: SQLite crée automatiquement le fichier de base de données à la première connexion. Aucune configuration supplémentaire nécessaire.

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Database (SQLite)
DB_DATABASE=database.sqlite

# JWT
# Générer une clé sécurisée avec : npm run generate:jwt-secret
JWT_SECRET=your-super-secret-key-change-in-production-minimum-64-characters
JWT_EXPIRES_IN=7d

# Admin par défaut (pour seed)
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

## 📁 Structure du projet

```
src/
├── auth/                  # Module d'authentification
│   ├── dto/
│   ├── guards/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── jwt.strategy.ts
├── posts/                 # Module publications
│   ├── dto/
│   ├── entities/
│   ├── posts.module.ts
│   ├── posts.service.ts
│   └── posts.controller.ts
├── pages/                 # Module pages
│   ├── dto/
│   ├── entities/
│   ├── pages.module.ts
│   ├── pages.service.ts
│   └── pages.controller.ts
├── messages/              # Module messages de contact
│   ├── dto/
│   ├── entities/
│   ├── messages.module.ts
│   ├── messages.service.ts
│   └── messages.controller.ts
├── settings/              # Module paramètres
│   ├── dto/
│   ├── entities/
│   ├── settings.module.ts
│   ├── settings.service.ts
│   └── settings.controller.ts
├── upload/                # Module upload d'images
│   ├── upload.module.ts
│   ├── upload.service.ts
│   └── upload.controller.ts
├── common/                # Utilitaires communs
│   ├── entities/
│   └── guards/
├── config/                # Configurations
├── app.module.ts
└── main.ts
```

---

## 🔌 API Endpoints

### 🔐 Authentification

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/api/auth/login` | Connexion admin | Public |
| POST | `/api/admins` | Créer un administrateur | Admin |
| GET | `/api/admins` | Liste des administrateurs | Admin |
| GET | `/api/admins/:id` | Détails d'un administrateur | Admin |
| DELETE | `/api/admins/:id` | Supprimer un administrateur | Admin |

**Body (Login)**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Login)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com"
  }
}
```

**Body (Create Admin)**
```json
{
  "email": "nouveau-admin@example.com",
  "password": "password123"
}
```

**Response (Create Admin)**
```json
{
  "id": "uuid-here",
  "email": "nouveau-admin@example.com",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

---

### 📰 Publications (Posts)

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/posts` | Liste des publications | Public |
| GET | `/api/posts/:id` | Détails d'une publication | Public |
| GET | `/api/posts/carousel` | Publications pour carousel | Public |
| POST | `/api/posts` | Créer une publication | Admin |
| PUT | `/api/posts/:id` | Modifier une publication | Admin |
| DELETE | `/api/posts/:id` | Supprimer une publication | Admin |

**Body (Create/Update Post)**
```json
{
  "title_fr": "Titre français",
  "title_en": "English title",
  "title_es": "Título español",
  "content_fr": "Contenu français...",
  "content_en": "English content...",
  "content_es": "Contenido español...",
  "image": "https://example.com/image.jpg",
  "show_in_carousel": true,
  "status": "published"
}
```

---

### 📄 Pages

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/pages` | Liste de toutes les pages | Public |
| GET | `/api/pages/:slug` | Contenu d'une page | Public |
| POST | `/api/pages` | Créer une nouvelle page | Admin |
| PUT | `/api/pages/:slug` | Modifier une page | Admin |
| DELETE | `/api/pages/:slug` | Supprimer une page | Admin |

**Slugs disponibles** : `home`, `about`, `services`, `contact`

**Body (Create Page)**
```json
{
  "slug": "home",
  "content_fr": "Contenu français...",
  "content_en": "English content...",
  "content_es": "Contenido español...",
  "image": "https://example.com/image.jpg"
}
```

**Body (Update Page)**
```json
{
  "content_fr": "Contenu français...",
  "content_en": "English content...",
  "content_es": "Contenido español...",
  "image": "https://example.com/image.jpg"
}
```

---

### 💬 Messages de contact

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/api/contact` | Envoyer un message | Public |
| GET | `/api/messages` | Liste des messages | Admin |
| PUT | `/api/messages/:id/read` | Marquer comme lu | Admin |

**Body (Create Message)**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Votre message ici..."
}
```

---

### ⚙️ Paramètres

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| GET | `/api/settings` | Récupérer les paramètres | Public |
| PUT | `/api/settings` | Modifier les paramètres | Admin |

**Body (Update Settings)**
```json
{
  "site_name": "Dayang Transport",
  "logo": "https://example.com/logo.png",
  "email": "contact@dayang.com",
  "phone": "+33 1 23 45 67 89",
  "social_links": {
    "facebook": "https://facebook.com/dayang",
    "twitter": "https://twitter.com/dayang",
    "linkedin": "https://linkedin.com/company/dayang"
  }
}
```

---

### 📸 Upload

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/api/upload` | Upload d'une image | Admin |

**Request** : `multipart/form-data` avec champ `file`

**Response**
```json
{
  "url": "/uploads/image-1234567890.jpg",
  "filename": "image-1234567890.jpg"
}
```

---

## 🔐 Authentification

Les routes admin nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

Les routes protégées retournent `401 Unauthorized` si le token est invalide ou manquant.

---

## 🗄️ Base de données

### Schéma des tables

#### `admins`
- `id` (UUID/INT)
- `email` (STRING, unique)
- `password` (STRING, hashé)
- `created_at` (DATE)

#### `posts`
- `id` (UUID/INT)
- `title_fr`, `title_en`, `title_es` (STRING)
- `content_fr`, `content_en`, `content_es` (TEXT)
- `image` (STRING, URL)
- `show_in_carousel` (BOOLEAN)
- `status` (ENUM: draft/published)
- `created_at` (DATE)

#### `pages`
- `id` (UUID/INT)
- `slug` (STRING, unique)
- `content_fr`, `content_en`, `content_es` (TEXT)
- `image` (STRING, URL)
- `updated_at` (DATE)

#### `messages`
- `id` (UUID/INT)
- `name` (STRING)
- `email` (STRING)
- `message` (TEXT)
- `is_read` (BOOLEAN)
- `created_at` (DATE)

#### `settings`
- `id` (UUID/INT)
- `site_name` (STRING)
- `logo` (STRING)
- `email` (STRING)
- `phone` (STRING)
- `social_links` (JSON)

---

## 🚀 Démarrage

### Mode développement
```bash
npm run start:dev
```

### Mode production
```bash
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000/api`

### 📚 Documentation Swagger
Une fois l'application démarrée, la documentation interactive Swagger est disponible sur :
- **Swagger UI** : `http://localhost:3000/api/docs`

Vous pouvez tester tous les endpoints directement depuis l'interface Swagger !

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📝 Notes

- Les mots de passe admin sont hashés avec bcrypt
- Les images uploadées sont stockées dans le dossier `uploads/` (à configurer pour production)
- Le CORS est configuré pour autoriser les requêtes depuis le frontend
- Toutes les réponses sont en JSON
- Les dates sont retournées en ISO 8601

---

## 📄 License

Ce projet est privé et propriétaire.

---

## 👤 Auteur

Développé pour Dayang Transport

---

## 🆘 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt.
