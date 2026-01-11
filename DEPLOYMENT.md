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

```bash
# Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou utiliser un générateur en ligne
```

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

### L'application ne démarre pas
- Vérifier les logs dans Railway
- Vérifier que le PORT est bien configuré
- Vérifier que `start:prod` fonctionne localement

### Erreur de base de données
- Vérifier les variables d'environnement
- Pour SQLite, vérifier les permissions d'écriture
- Considérer PostgreSQL pour production

### Erreur 404
- Vérifier que le préfixe `/api` est bien configuré
- Vérifier que les routes sont bien exposées

---

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation Render](https://render.com/docs)
- [Documentation Fly.io](https://fly.io/docs)

---

**Bon déploiement ! 🚀**
