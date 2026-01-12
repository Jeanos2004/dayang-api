# ☁️ Configuration Cloudinary - Guide Rapide

## Pourquoi Cloudinary ?

Sur Railway (et autres plateformes cloud), les fichiers locaux ne persistent pas entre les redéploiements. **Cloudinary** résout ce problème en stockant vos images dans le cloud.

**Avantages :**
- ✅ **Gratuit** jusqu'à 25GB
- ✅ **Persistance garantie** (fichiers jamais perdus)
- ✅ **CDN intégré** (chargement rapide)
- ✅ **Optimisation automatique** des images
- ✅ **URLs HTTPS** sécurisées

---

## 🚀 Configuration en 3 étapes

### Étape 1 : Créer un compte Cloudinary

1. Aller sur [cloudinary.com](https://cloudinary.com)
2. Cliquer sur **"Sign Up for Free"**
3. Remplir le formulaire (email, mot de passe, nom)
4. Confirmer votre email

### Étape 2 : Récupérer vos credentials

Une fois connecté au Dashboard :

1. Vous verrez votre **Cloud Name** en haut à droite (ex: `dxyz1234`)
2. Cliquer sur **"Account Details"** ou **"Settings"**
3. Vous verrez :
   - **Cloud Name** : `votre-cloud-name`
   - **API Key** : `123456789012345`
   - **API Secret** : `abcdefghijklmnopqrstuvwxyz` (cliquer sur "Reveal" pour voir)

### Étape 3 : Configurer sur Railway

1. Ouvrir votre projet sur [Railway.app](https://railway.app)
2. Aller dans l'onglet **"Variables"**
3. Ajouter ces 3 variables :

```
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

4. **Redémarrer le service** Railway (ou attendre le redéploiement automatique)

---

## ✅ Vérification

1. **Tester l'upload** :
   - Se connecter via `POST /api/auth/login`
   - Uploader une image via `POST /api/upload`
   - L'URL retournée devrait être une URL Cloudinary (ex: `https://res.cloudinary.com/votre-cloud-name/image/upload/...`)

2. **Vérifier sur Cloudinary** :
   - Aller dans le Dashboard Cloudinary
   - Onglet **"Media Library"**
   - Vous devriez voir vos images dans le dossier `dayang-transport/`

---

## 🔧 Configuration locale (optionnel)

Pour tester localement avec Cloudinary, ajouter dans votre `.env` :

```env
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

---

## 📝 Notes importantes

- **Gratuit jusqu'à 25GB** de stockage
- **25GB de bande passante/mois** gratuite
- Les images sont automatiquement optimisées (compression, format auto)
- Les URLs sont HTTPS et accessibles partout dans le monde
- Les fichiers sont organisés dans le dossier `dayang-transport/` sur Cloudinary

---

## 🆘 Dépannage

### Les images ne s'uploadent pas vers Cloudinary

1. Vérifier que les 3 variables sont bien définies sur Railway
2. Vérifier que les credentials sont corrects (pas d'espaces, pas de guillemets)
3. Redémarrer le service Railway
4. Vérifier les logs Railway pour voir les erreurs

### L'application utilise toujours le stockage local

- Vérifier que les 3 variables Cloudinary sont bien définies
- Vérifier les logs au démarrage : vous devriez voir `✅ Cloudinary configuré pour le stockage des médias`
- Si vous voyez `⚠️ Cloudinary non configuré`, c'est que les variables ne sont pas détectées

---

**C'est tout ! Vos médias sont maintenant persistants sur Railway ! 🎉**
