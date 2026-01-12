# 🚀 Guide de Déploiement Gratuit

Ce guide vous explique comment déployer gratuitement votre API NestJS.

## 📋 Options de Déploiement Gratuit

### 1. **Railway.app** (Recommandé ⭐)

**Avantages :**
- ✅ Gratuit avec $5 de crédits/mois
- ✅ Déploiement automatique depuis GitHub
- ✅ Support SQLite et PostgreSQL gratuit
- ✅ Simple à utiliser
- ✅ Logs intégrés

**Déploiement :**
1. Créer un compte sur [Railway.app](https://railway.app)
2. Cliquer sur "New Project" → "Deploy from GitHub repo"
3. Sélectionner votre repository
4. Railway détecte automatiquement NestJS
5. Ajouter les variables d'environnement dans "Variables"
6. Optionnel : Ajouter PostgreSQL (gratuit) si besoin

**Variables d'environnement nécessaires :**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
DB_DATABASE=database.sqlite
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=votre-mot-de-passe-securise

# Cloudinary (Recommandé pour les médias - gratuit jusqu'à 25GB)
# Créer un compte sur https://cloudinary.com
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

---

### 2. **Render.com** (Alternative)

**Avantages :**
- ✅ Gratuit (avec limitations)
- ✅ Déploiement depuis GitHub
- ✅ Support PostgreSQL gratuit
- ⚠️ Sleep après inactivité (gratuit)

**Déploiement :**
1. Créer un compte sur [Render.com](https://render.com)
2. "New" → "Web Service"
3. Connecter votre GitHub repo
4. Configuration :
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Node
5. Ajouter les variables d'environnement
6. Pour SQLite, utiliser un volume persistant (payant) ou migrer vers PostgreSQL

**Note:** Le plan gratuit a un "sleep" après inactivité. Pour éviter cela, utiliser Railway.

---

### 3. **Fly.io** (Avancé)

**Avantages :**
- ✅ Gratuit avec limitations
- ✅ Performant
- ✅ Support volumes pour SQLite
- ⚠️ Plus complexe à configurer

**Déploiement :**
1. Installer Fly CLI : `npm install -g @fly/cli`
2. Créer un compte : `fly auth signup`
3. Dans le projet : `fly launch`
4. Configurer `fly.toml`
5. Déployer : `fly deploy`

---

### 4. **Replit** (Pour tests/demos)

**Avantages :**
- ✅ Gratuit
- ✅ Éditeur en ligne
- ⚠️ Limité pour production

---

## 🎯 Recommandation : Railway.app

Pour ce projet, nous recommandons **Railway.app** car :
1. Simple à utiliser
2. Déploiement automatique depuis GitHub
3. Support SQLite natif
4. Pas de "sleep" comme Render
5. $5 crédits/mois gratuits (suffisant pour petits projets)

---

## 📝 Préparation du Projet

### 1. Ajouter un fichier `.railway.json` (optionnel)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Vérifier `package.json`

S'assurer que le script `start:prod` existe :
```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

### 3. Ajouter un `.gitignore`

Vérifier que les fichiers sensibles sont ignorés :
```
.env
node_modules/
dist/
database.sqlite
uploads/
```

### 4. Créer un fichier `Procfile` (pour certaines plateformes)

```
web: npm run start:prod
```

---

## 🔐 Sécurité en Production

### Variables d'environnement importantes :

```env
# Toujours changer en production !
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire-minimum-32-caracteres
ADMIN_PASSWORD=mot-de-passe-securise-et-long

# Base de données
DB_DATABASE=database.sqlite
# OU pour PostgreSQL (recommandé en production)
DB_TYPE=postgres
DB_HOST=votre-host
DB_PORT=5432
DB_USERNAME=votre-username
DB_PASSWORD=votre-password
DB_DATABASE=votre-database
```

### Générer un JWT_SECRET sécurisé :

**Méthode 1 : Utiliser le script du projet (Recommandé)**
```bash
npm run generate:jwt-secret
```

**Méthode 2 : Commande Node.js directe**
```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Linux/Mac
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Méthode 3 : En ligne de commande OpenSSL**
```bash
# Windows (si OpenSSL installé)
openssl rand -hex 64

# Linux/Mac
openssl rand -hex 64
```

**Méthode 4 : Générateur en ligne**
- Visitez : https://generate-secret.vercel.app/64
- Ou : https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

**Important :**
- Utilisez au minimum 32 caractères (64 bytes = 512 bits recommandé)
- Ne partagez JAMAIS cette clé
- Utilisez une clé différente pour chaque environnement (dev, staging, prod)

---

## 🚀 Déploiement Step-by-Step (Railway)

### Étape 1 : Préparer le code
```bash
# S'assurer que tout compile
npm run build

# Tester localement
npm run start:prod
```

### Étape 2 : Push sur GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Étape 3 : Déployer sur Railway
1. Aller sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Autoriser l'accès GitHub
4. Sélectionner le repository
5. Railway détecte automatiquement et déploie

### Étape 4 : Configurer les variables
1. Ouvrir le projet sur Railway
2. Onglet "Variables"
3. Ajouter toutes les variables d'environnement
4. Le service redémarre automatiquement

### Étape 5 : Obtenir l'URL
1. Onglet "Settings"
2. Générer un domaine (gratuit)
3. Votre API est accessible sur `https://votre-projet.railway.app/api`

---

## 📊 Migration vers PostgreSQL (Optionnel mais Recommandé)

Pour une base de données plus robuste en production :

### Sur Railway :
1. "New" → "Database" → "Add PostgreSQL"
2. Railway crée automatiquement les variables
3. Modifier `app.module.ts` pour utiliser PostgreSQL

### Variables automatiques Railway :
```
PGHOST
PGPORT
PGUSER
PGPASSWORD
PGDATABASE
```

---

## 🔍 Vérification Post-Déploiement

1. **Tester l'API** :
   ```bash
   curl https://votre-projet.railway.app/api
   ```

2. **Tester Swagger** :
   Ouvrir : `https://votre-projet.railway.app/api/docs`

3. **Tester l'authentification** :
   ```bash
   curl -X POST https://votre-projet.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"votre-password"}'
   ```

---

## 🆘 Dépannage

### Erreur "no such table: admins" ou tables manquantes

**Problème :** La base de données SQLite est créée mais les tables n'existent pas.

**Solution :** L'application initialise maintenant automatiquement la base de données au démarrage. Si le problème persiste :

1. **Vérifier que `synchronize: true` est activé** dans `app.module.ts` (déjà fait)
2. **Redémarrer le service Railway** pour que l'initialisation se fasse
3. **Vérifier les logs Railway** pour voir si l'initialisation s'est bien passée

**Logs attendus au démarrage :**
```
✅ Base de données initialisée
✅ Admin créé: admin@dayang.com
🚀 Application is running on: http://localhost:3000/api
```

### L'application ne démarre pas
- Vérifier les logs dans Railway (Dashboard → Service → Deployments → Logs)
- Vérifier que le PORT est bien configuré (Railway le définit automatiquement)
- Vérifier que `start:prod` fonctionne localement
- Vérifier que toutes les variables d'environnement sont définies

### Erreur de base de données
- Vérifier les variables d'environnement
- Pour SQLite sur Railway, la base est créée automatiquement
- Considérer PostgreSQL pour production (plus fiable)
- Vérifier les logs pour voir les erreurs SQL

### Erreur 404
- Vérifier que le préfixe `/api` est bien configuré
- Vérifier que les routes sont bien exposées
- Tester avec `/api/docs` pour voir si Swagger fonctionne

### Erreur 500 au login / L'admin n'existe pas
- L'application crée automatiquement l'admin au démarrage
- Vérifier que `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont bien définis dans Railway
- Vérifier les logs pour voir si l'admin a été créé
- Si nécessaire, redémarrer le service Railway

### Erreur 404 sur les fichiers uploadés (`/uploads/...`)

**Problème :** Les fichiers uploadés ne sont pas accessibles ou disparaissent après un redéploiement.

**Cause :** Sur Railway (et la plupart des plateformes cloud), les fichiers locaux ne persistent pas entre les redéploiements. Le système de fichiers est éphémère.

**✅ Solution : Cloudinary (Déjà intégré !)**

L'application utilise maintenant **Cloudinary** par défaut si configuré. C'est la solution recommandée.

#### Configuration Cloudinary sur Railway

1. **Créer un compte Cloudinary** (gratuit) :
   - Aller sur [cloudinary.com](https://cloudinary.com)
   - Créer un compte gratuit (25GB de stockage gratuit)
   - Une fois connecté, aller dans le Dashboard

2. **Récupérer les credentials** :
   - Dans le Dashboard, vous verrez :
     - **Cloud Name** (ex: `dxyz1234`)
     - **API Key** (ex: `123456789012345`)
     - **API Secret** (ex: `abcdefghijklmnopqrstuvwxyz`)

3. **Ajouter les variables sur Railway** :
   - Ouvrir votre projet Railway
   - Onglet "Variables"
   - Ajouter ces 3 variables :
     ```
     CLOUDINARY_CLOUD_NAME=votre-cloud-name
     CLOUDINARY_API_KEY=votre-api-key
     CLOUDINARY_API_SECRET=votre-api-secret
     ```
   - Redémarrer le service

4. **Tester** :
   - Uploader une image via `POST /api/upload`
   - L'URL retournée sera une URL Cloudinary HTTPS (ex: `https://res.cloudinary.com/...`)
   - Cette URL persiste même après redéploiement !

#### ⚠️ Fallback : Stockage local (si Cloudinary non configuré)

Si Cloudinary n'est pas configuré, l'application utilise le stockage local :
- ✅ Fonctionne pour les tests et démos
- ❌ Les fichiers disparaissent après redéploiement
- Les URLs retournées (`/uploads/...`) fonctionnent uniquement si le fichier existe encore

---

## 📁 Gestion des Fichiers Uploadés

### ✅ Configuration Cloudinary (Recommandé - Déjà intégré !)

L'application utilise **Cloudinary** par défaut si les variables d'environnement sont configurées.

**Variables d'environnement :**
```env
# Cloudinary (Recommandé pour production)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Upload (Fallback si Cloudinary non configuré)
UPLOAD_DEST=./uploads  # Chemin relatif ou absolu
MAX_FILE_SIZE=5242880  # 5MB par défaut
```

**Endpoints :**
- `POST /api/upload` - Uploader une image (Admin uniquement)
  - Retourne une URL Cloudinary HTTPS si configuré
  - Retourne une URL locale `/uploads/...` si Cloudinary non configuré

**Avantages de Cloudinary :**
- ✅ Persistance garantie (fichiers jamais perdus)
- ✅ CDN intégré (chargement rapide partout dans le monde)
- ✅ Transformations d'images automatiques (redimensionnement, compression)
- ✅ URLs HTTPS sécurisées
- ✅ Gratuit jusqu'à 25GB
- ✅ Pas de perte de fichiers lors des redéploiements
- ✅ Optimisation automatique des images (qualité auto, format auto)

**Comment ça fonctionne :**
1. Si Cloudinary est configuré → Upload vers Cloudinary → URL HTTPS retournée
2. Si Cloudinary n'est pas configuré → Upload local → URL `/uploads/...` retournée (⚠️ perdue après redéploiement)

---

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation Render](https://render.com/docs)
- [Documentation Fly.io](https://fly.io/docs)

---

**Bon déploiement ! 🚀**
