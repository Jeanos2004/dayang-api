# 🔧 Configuration PostgreSQL sur Railway - Guide Complet

## 📋 Instructions Railway

Railway demande de créer une variable `DATABASE_URL` avec la valeur `${{ Postgres.DATABASE_URL }}`.

## ✅ Étapes à suivre

### Étape 1 : Vérifier que PostgreSQL est créé

1. Dans Railway, vérifier que vous avez un service **PostgreSQL**
2. Si non, créer : "New" → "Database" → "Add PostgreSQL"

### Étape 2 : Lier PostgreSQL au service web

**Méthode A : Via la variable DATABASE_URL (Recommandée)**

1. Ouvrir votre **service web** (NestJS) dans Railway
2. Aller dans l'onglet **"Variables"**
3. Cliquer sur **"New Variable"**
4. Nom de la variable : `DATABASE_URL`
5. Valeur : `${{ Postgres.DATABASE_URL }}`
   - ⚠️ **Important** : Remplacer `Postgres` par le nom EXACT de votre service PostgreSQL
   - Si votre service PostgreSQL s'appelle "PostgreSQL", utiliser : `${{ PostgreSQL.DATABASE_URL }}`
6. Cliquer sur "Add"

**Méthode B : Via les variables PGHOST, PGUSER, etc. (Alternative)**

Si Railway ne crée pas automatiquement les variables séparées :
1. Dans le service web → "Variables"
2. Cliquer sur "New Variable"
3. Pour chaque variable :
   - `PGHOST` = `${{ Postgres.PGHOST }}`
   - `PGPORT` = `${{ Postgres.PGPORT }}`
   - `PGUSER` = `${{ Postgres.PGUSER }}`
   - `PGPASSWORD` = `${{ Postgres.PGPASSWORD }}`
   - `PGDATABASE` = `${{ Postgres.PGDATABASE }}`

### Étape 3 : Vérifier le nom du service PostgreSQL

**IMPORTANT** : Le nom dans `${{ Postgres.DATABASE_URL }}` doit correspondre au **nom exact** de votre service PostgreSQL dans Railway.

Pour trouver le nom :
1. Regarder la liste des services dans Railway
2. Trouver le service PostgreSQL
3. Le nom est celui affiché (peut être "Postgres", "PostgreSQL", "postgres", etc.)

**Exemples** :
- Si le service s'appelle "Postgres" → `${{ Postgres.DATABASE_URL }}`
- Si le service s'appelle "PostgreSQL" → `${{ PostgreSQL.DATABASE_URL }}`
- Si le service s'appelle "postgres-db" → `${{ postgres-db.DATABASE_URL }}`

### Étape 4 : Redémarrer le service

1. Après avoir ajouté la variable, **redémarrer le service web**
2. Railway résoudra automatiquement `${{ Postgres.DATABASE_URL }}` en une vraie URL PostgreSQL

---

## ✅ Vérification

Après redéploiement, les logs devraient montrer :

**✅ Si ça fonctionne :**
```
📊 DATABASE_URL détectée, parsing...
📊 Configuration PostgreSQL (depuis DATABASE_URL):
   Host: containers-us-west-xxx.railway.app  (OU une IP valide)
   Port: 5432
   Database: railway
   Username: postgres
✅ Base de données initialisée
```

**❌ Si le host est toujours invalide :**
```
⚠️  DATABASE_URL pointe vers le service web (web.railway.internal), pas PostgreSQL !
⚠️  Utilisation de SQLite en fallback
```

---

## 🆘 Problèmes Courants

### Problème 1 : "DATABASE_URL pointe vers web.railway.internal"

**Cause :** La variable `DATABASE_URL` n'est pas correctement résolue par Railway.

**Solutions :**
1. Vérifier que le nom du service PostgreSQL est correct dans `${{ Postgres.DATABASE_URL }}`
2. Supprimer et recréer la variable `DATABASE_URL`
3. Vérifier que PostgreSQL est bien démarré
4. Redémarrer les deux services (PostgreSQL puis service web)

### Problème 2 : Variable non résolue

**Symptôme :** `DATABASE_URL` contient littéralement `${{ Postgres.DATABASE_URL }}`

**Solution :** Vérifier que :
- Le service PostgreSQL existe et est démarré
- Le nom du service est correct
- Les services sont dans le même projet Railway

### Problème 3 : Erreur ECONNREFUSED même avec bon host

**Solution :**
1. Vérifier que PostgreSQL est "Running" (pas "Stopped")
2. Attendre quelques secondes après le démarrage de PostgreSQL
3. Redémarrer le service web

---

## 📝 Exemple Complet

### Scénario : Service PostgreSQL nommé "Postgres"

1. **Dans le service web → Variables** :
   ```
   DATABASE_URL = ${{ Postgres.DATABASE_URL }}
   ```

2. **Après redéploiement, Railway résout automatiquement en :**
   ```
   DATABASE_URL = postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```

3. **L'application détecte et utilise PostgreSQL ✅**

---

## 🔄 Alternative : Variables Séparées

Si `DATABASE_URL` ne fonctionne pas, utiliser les variables séparées :

Dans le service web → Variables :
```
PGHOST = ${{ Postgres.PGHOST }}
PGPORT = ${{ Postgres.PGPORT }}
PGUSER = ${{ Postgres.PGUSER }}
PGPASSWORD = ${{ Postgres.PGPASSWORD }}
PGDATABASE = ${{ Postgres.PGDATABASE }}
```

---

**Une fois configuré, vos données PostgreSQL persisteront entre les déploiements ! 🎉**
