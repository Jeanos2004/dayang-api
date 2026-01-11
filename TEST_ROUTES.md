# 🧪 Guide de Test des Routes API

Ce document liste toutes les routes disponibles et comment les tester.

## 📋 Prérequis

1. L'application doit être démarrée : `npm run start:dev`
2. Pour les routes protégées, vous aurez besoin d'un token JWT (obtenu via `/api/auth/login`)
3. Les données de test peuvent être créées avec : `npm run seed:data`

## 🔑 Obtenir un Token JWT

D'abord, connectez-vous pour obtenir un token :

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "changeme123"
  }'
```

Réponse :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

Copiez le `access_token` pour les requêtes protégées.

---

## 🔐 Auth - Authentification

### POST /api/auth/login
**Accès :** Public  
**Body :**
```json
{
  "email": "admin@example.com",
  "password": "changeme123"
}
```

**Test :**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"changeme123"}'
```

---

## 👥 Admins - Gestion des Administrateurs

### POST /api/admins
**Accès :** Admin (JWT requis)  
**Body :**
```json
{
  "email": "nouveau-admin@example.com",
  "password": "password123"
}
```

**Test :**
```bash
curl -X POST http://localhost:3000/api/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"nouveau-admin@example.com","password":"password123"}'
```

### GET /api/admins
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X GET http://localhost:3000/api/admins \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET /api/admins/:id
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X GET http://localhost:3000/api/admins/UUID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### DELETE /api/admins/:id
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X DELETE http://localhost:3000/api/admins/UUID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📰 Posts - Publications

### GET /api/posts
**Accès :** Public  
**Query params (optionnel) :** `?status=published` ou `?status=draft`

**Test :**
```bash
curl -X GET http://localhost:3000/api/posts
curl -X GET "http://localhost:3000/api/posts?status=published"
```

### GET /api/posts/carousel
**Accès :** Public

**Test :**
```bash
curl -X GET http://localhost:3000/api/posts/carousel
```

### GET /api/posts/:id
**Accès :** Public

**Test :**
```bash
curl -X GET http://localhost:3000/api/posts/UUID_HERE
```

### POST /api/posts
**Accès :** Admin (JWT requis)  
**Body :**
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

**Test :**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title_fr": "Titre français",
    "title_en": "English title",
    "title_es": "Título español",
    "content_fr": "Contenu français...",
    "content_en": "English content...",
    "content_es": "Contenido español...",
    "status": "published"
  }'
```

### PATCH /api/posts/:id
**Accès :** Admin (JWT requis)  
**Body :** (tous les champs optionnels)

**Test :**
```bash
curl -X PATCH http://localhost:3000/api/posts/UUID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"published"}'
```

### DELETE /api/posts/:id
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X DELETE http://localhost:3000/api/posts/UUID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📄 Pages - Pages du Site

### GET /api/pages
**Accès :** Public

**Test :**
```bash
curl -X GET http://localhost:3000/api/pages
```

### GET /api/pages/:slug
**Accès :** Public  
**Slugs disponibles :** `home`, `about`, `services`, `contact`

**Test :**
```bash
curl -X GET http://localhost:3000/api/pages/home
curl -X GET http://localhost:3000/api/pages/about
curl -X GET http://localhost:3000/api/pages/services
curl -X GET http://localhost:3000/api/pages/contact
```

### POST /api/pages
**Accès :** Admin (JWT requis)  
**Body :**
```json
{
  "slug": "home",
  "content_fr": "Nouveau contenu français...",
  "content_en": "New English content...",
  "content_es": "Nuevo contenido español...",
  "image": "https://example.com/image.jpg"
}
```

**Test :**
```bash
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "slug": "home",
    "content_fr": "Nouveau contenu",
    "content_en": "New content",
    "content_es": "Nuevo contenido"
  }'
```

### PUT /api/pages/:slug
**Accès :** Admin (JWT requis)  
**Body :**
```json
{
  "content_fr": "Nouveau contenu français...",
  "content_en": "New English content...",
  "content_es": "Nuevo contenido español...",
  "image": "https://example.com/image.jpg"
}
```

**Test :**
```bash
curl -X PUT http://localhost:3000/api/pages/home \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content_fr": "Nouveau contenu",
    "content_en": "New content",
    "content_es": "Nuevo contenido"
  }'
```

### DELETE /api/pages/:slug
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X DELETE http://localhost:3000/api/pages/home \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 💬 Messages - Messages de Contact

### POST /api/contact
**Accès :** Public  
**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Votre message ici..."
}
```

**Test :**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Bonjour, je souhaite des informations"
  }'
```

### GET /api/messages
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X GET http://localhost:3000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### PATCH /api/messages/:id/read
**Accès :** Admin (JWT requis)

**Test :**
```bash
curl -X PATCH http://localhost:3000/api/messages/UUID_HERE/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚙️ Settings - Paramètres

### GET /api/settings
**Accès :** Public

**Test :**
```bash
curl -X GET http://localhost:3000/api/settings
```

### PUT /api/settings
**Accès :** Admin (JWT requis)  
**Body :**
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

**Test :**
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "site_name": "Dayang Transport",
    "email": "contact@dayang.com"
  }'
```

---

## 📸 Upload - Upload d'Images

### POST /api/upload
**Accès :** Admin (JWT requis)  
**Content-Type :** `multipart/form-data`  
**Body :** Form data avec champ `file`

**Test avec curl :**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/chemin/vers/image.jpg"
```

**Test avec Swagger :**
- Aller sur `http://localhost:3000/api/docs`
- Section "upload"
- Cliquer sur "Try it out"
- Sélectionner un fichier image
- Cliquer sur "Execute"

---

## 📚 Swagger UI - Tester Graphiquement

La façon la plus simple de tester toutes les routes :

1. **Démarrer l'application :**
   ```bash
   npm run start:dev
   ```

2. **Ouvrir Swagger :**
   ```
   http://localhost:3000/api/docs
   ```

3. **Se connecter :**
   - Cliquer sur le bouton "Authorize" (🔒 en haut à droite)
   - Obtenir un token via `/api/auth/login`
   - Coller le token dans le champ
   - Cliquer sur "Authorize"

4. **Tester les endpoints :**
   - Tous les endpoints sont listés par catégorie
   - Cliquer sur un endpoint
   - Cliquer sur "Try it out"
   - Remplir les champs si nécessaire
   - Cliquer sur "Execute"
   - Voir la réponse

---

## ✅ Checklist de Test

### Routes Publiques
- [ ] GET /api/posts
- [ ] GET /api/posts/carousel
- [ ] GET /api/posts/:id
- [ ] GET /api/pages/:slug (home, about, services, contact)
- [ ] POST /api/contact
- [ ] GET /api/settings
- [ ] POST /api/auth/login

### Routes Protégées (Admin)
- [ ] POST /api/posts
- [ ] PATCH /api/posts/:id
- [ ] DELETE /api/posts/:id
- [ ] PUT /api/pages/:slug
- [ ] GET /api/messages
- [ ] PATCH /api/messages/:id/read
- [ ] PUT /api/settings
- [ ] POST /api/upload
- [ ] POST /api/admins
- [ ] GET /api/admins
- [ ] GET /api/admins/:id
- [ ] DELETE /api/admins/:id

---

## 🐛 Dépannage

### Erreur 401 (Unauthorized)
- Vérifier que le token JWT est valide
- Vérifier que le token est dans le header : `Authorization: Bearer TOKEN`
- Le token expire après 7 jours (configurable)

### Erreur 404 (Not Found)
- Vérifier que l'application est démarrée
- Vérifier que le préfixe `/api` est présent
- Vérifier l'URL complète

### Erreur 400 (Bad Request)
- Vérifier le format JSON du body
- Vérifier que tous les champs requis sont présents
- Vérifier les types de données (email valide, etc.)

### Erreur 500 (Internal Server Error)
- Vérifier les logs de l'application
- Vérifier que la base de données est accessible
- Vérifier que les données de test existent (`npm run seed:data`)

---

**Bon testing ! 🚀**
