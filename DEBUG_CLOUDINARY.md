# 🐛 Débogage Cloudinary - Guide

## Vérifier si Cloudinary est configuré

### 1. Vérifier les logs au démarrage

Quand l'application démarre, vous devriez voir dans les logs :

**✅ Si Cloudinary est configuré :**
```
✅ Cloudinary configuré pour le stockage des médias
   Cloud Name: votre-cloud-name
   API Key: 1234...
```

**⚠️ Si Cloudinary n'est PAS configuré :**
```
⚠️  Cloudinary non configuré, utilisation du stockage local
```

### 2. Vérifier les variables d'environnement sur Railway

1. Aller sur [Railway.app](https://railway.app)
2. Ouvrir votre projet
3. Onglet **"Variables"**
4. Vérifier que ces 3 variables existent et ont des valeurs :
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

**⚠️ Important :**
- Les variables doivent être **exactement** comme ci-dessus (majuscules/minuscules)
- Pas d'espaces avant/après les valeurs
- Pas de guillemets autour des valeurs

### 3. Vérifier les logs lors d'un upload

Quand vous uploadez un fichier, vous devriez voir dans les logs Railway :

**✅ Si Cloudinary fonctionne :**
```
🔄 Utilisation de Cloudinary pour l'upload
📤 Upload vers Cloudinary: dayang-1234567890-abc123.jpg (123456 bytes)
✅ Upload réussi vers Cloudinary: https://res.cloudinary.com/...
📁 Public ID: dayang-transport/dayang-1234567890-abc123
📂 Dossier: dayang-transport/
```

**⚠️ Si Cloudinary n'est pas utilisé :**
```
🔄 Utilisation du stockage local pour l'upload
```

**❌ Si erreur :**
```
❌ Erreur lors de l'upload Cloudinary: [message d'erreur]
```

---

## Problèmes courants et solutions

### Problème 1 : "Cloudinary non configuré" dans les logs

**Cause :** Les variables d'environnement ne sont pas définies ou mal nommées.

**Solution :**
1. Vérifier que les 3 variables existent sur Railway
2. Vérifier l'orthographe exacte (majuscules/minuscules)
3. Redémarrer le service Railway après avoir ajouté les variables

### Problème 2 : Les fichiers ne sont pas visibles sur Cloudinary

**Vérifications :**

1. **Vérifier le dossier sur Cloudinary :**
   - Aller sur [cloudinary.com](https://cloudinary.com)
   - Se connecter au Dashboard
   - Aller dans **"Media Library"**
   - Chercher le dossier **`dayang-transport`**
   - Les fichiers devraient être dedans

2. **Vérifier les logs Railway :**
   - Regarder les logs lors de l'upload
   - Vérifier si l'upload a réussi (message `✅ Upload réussi`)
   - Vérifier le Public ID retourné

3. **Vérifier l'URL retournée :**
   - Après un upload réussi, l'API retourne une URL
   - Cette URL devrait commencer par `https://res.cloudinary.com/...`
   - Si c'est `/uploads/...`, c'est que Cloudinary n'est pas utilisé

### Problème 3 : Erreur "Invalid API credentials"

**Cause :** Les credentials Cloudinary sont incorrects.

**Solution :**
1. Aller sur [cloudinary.com](https://cloudinary.com)
2. Dashboard → **"Settings"** → **"Security"**
3. Vérifier :
   - **Cloud Name** (en haut à droite du dashboard)
   - **API Key** (dans Settings)
   - **API Secret** (cliquer sur "Reveal" pour voir)
4. Copier ces valeurs exactement dans Railway
5. Redémarrer le service

### Problème 4 : Erreur "Upload failed" ou timeout

**Causes possibles :**
- Fichier trop volumineux (limite Cloudinary gratuite : 10MB par fichier)
- Problème de connexion réseau
- Credentials invalides

**Solution :**
1. Vérifier la taille du fichier (doit être < 10MB)
2. Vérifier les credentials
3. Réessayer l'upload

---

## Test manuel de Cloudinary

### Test 1 : Vérifier la configuration

```bash
# Sur Railway, dans les logs au démarrage, chercher :
✅ Cloudinary configuré pour le stockage des médias
```

### Test 2 : Uploader un fichier

1. Se connecter via `POST /api/auth/login`
2. Uploader une image via `POST /api/upload`
3. Vérifier la réponse :
   ```json
   {
     "url": "https://res.cloudinary.com/votre-cloud-name/image/upload/...",
     "filename": "dayang-transport/dayang-..."
   }
   ```
4. Si l'URL commence par `https://res.cloudinary.com`, c'est bon ✅
5. Si l'URL commence par `/uploads/`, Cloudinary n'est pas utilisé ⚠️

### Test 3 : Vérifier sur Cloudinary

1. Aller sur [cloudinary.com](https://cloudinary.com)
2. Dashboard → **"Media Library"**
3. Chercher le dossier **`dayang-transport`**
4. Vos fichiers devraient être dedans

---

## Commandes utiles

### Voir les logs Railway en temps réel

1. Aller sur Railway
2. Ouvrir votre service
3. Onglet **"Deployments"**
4. Cliquer sur le dernier déploiement
5. Onglet **"Logs"**

### Tester l'upload via curl

```bash
# 1. Se connecter
curl -X POST https://votre-projet.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"votre-password"}'

# 2. Récupérer le token de la réponse

# 3. Uploader une image
curl -X POST https://votre-projet.railway.app/api/upload \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -F "file=@chemin/vers/image.jpg"
```

---

## Checklist de débogage

- [ ] Les 3 variables Cloudinary sont définies sur Railway
- [ ] Les variables ont les bons noms (majuscules/minuscules exactes)
- [ ] Les valeurs sont correctes (pas d'espaces, pas de guillemets)
- [ ] Le service Railway a été redémarré après avoir ajouté les variables
- [ ] Les logs au démarrage montrent "✅ Cloudinary configuré"
- [ ] Les logs lors de l'upload montrent "🔄 Utilisation de Cloudinary"
- [ ] L'URL retournée commence par `https://res.cloudinary.com/`
- [ ] Les fichiers sont visibles dans le dossier `dayang-transport` sur Cloudinary

---

**Si après toutes ces vérifications ça ne fonctionne toujours pas, partagez les logs Railway et je vous aiderai ! 🚀**
