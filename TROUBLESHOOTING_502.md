# 🔧 Dépannage Erreur 502 - PostgreSQL Railway

## ⚠️ Symptôme
- Erreur 502 "Application failed to respond"
- L'API ne répond pas
- L'application ne démarre pas

## 🔍 Causes Possibles

### 1. Variables PostgreSQL manquantes ou incorrectes

**Vérifier sur Railway :**
1. Aller dans votre projet Railway
2. Onglet "Variables"
3. Vérifier que ces 5 variables existent (créées automatiquement par Railway PostgreSQL) :
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

**Si elles manquent :**
- Vérifier que PostgreSQL a bien été ajouté à votre projet
- Redémarrer le service après avoir ajouté PostgreSQL

### 2. PostgreSQL non démarré

**Vérifier :**
1. Dans Railway, aller sur le service PostgreSQL
2. Vérifier qu'il est bien démarré (statut "Running")
3. Si ce n'est pas le cas, redémarrer le service PostgreSQL

### 3. Problème de connexion SSL

**Solution déjà implémentée :**
- Le code utilise `rejectUnauthorized: false` pour Railway
- Si le problème persiste, vérifier les logs

### 4. Erreur lors de l'initialisation TypeORM

**Vérifier les logs Railway :**
1. Aller dans "Deployments" → Dernier déploiement → "Logs"
2. Chercher les erreurs commençant par :
   - `❌ Erreur fatale`
   - `⚠️ Erreur lors de l'initialisation`
   - `TypeORM connection error`

---

## 📋 Checklist de Débogage

### Étape 1 : Vérifier les logs Railway

Dans les logs, vous devriez voir :

**✅ Si PostgreSQL est détecté :**
```
📊 Configuration PostgreSQL détectée:
   Host: [votre-host]
   Port: 5432
   Database: [votre-database]
   Username: [votre-username]
📊 Utilisation de PostgreSQL
✅ Base de données initialisée
✅ Admin créé: admin@dayang.com
🚀 Application is running on: http://localhost:3000/api
```

**❌ Si erreur :**
```
❌ Erreur fatale lors du démarrage de l'application: [détails]
⚠️ Erreur lors de l'initialisation de la base de données: [détails]
```

### Étape 2 : Vérifier les variables PostgreSQL

Dans Railway, vérifier que les variables ont ces valeurs (exemples) :

```
PGHOST=containers-us-west-xxx.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=xxxxxxxxxxxxx
PGDATABASE=railway
```

**⚠️ Important :**
- Pas d'espaces avant/après les valeurs
- Pas de guillemets autour des valeurs
- Les valeurs sont sensibles à la casse

### Étape 3 : Tester la connexion PostgreSQL

Vous pouvez tester la connexion avec `psql` (si vous avez accès) :

```bash
psql -h $PGHOST -U $PGUSER -d $PGDATABASE
```

### Étape 4 : Vérifier que PostgreSQL est lié au service

1. Dans Railway, ouvrir votre service web (NestJS)
2. Onglet "Variables"
3. Vérifier qu'il y a une section "Connected Services" ou "PostgreSQL"
4. Le service PostgreSQL doit être lié

---

## 🛠️ Solutions

### Solution 1 : Redémarrer les services

1. Redémarrer le service PostgreSQL dans Railway
2. Attendre qu'il soit complètement démarré
3. Redémarrer le service web (NestJS)

### Solution 2 : Re-créer PostgreSQL

1. Supprimer l'ancien service PostgreSQL
2. Créer un nouveau : "New" → "Database" → "Add PostgreSQL"
3. Railway créera automatiquement les variables
4. Redéployer le service web

### Solution 3 : Vérifier que le code est à jour

1. Vérifier que le dernier code est déployé
2. Vérifier que `app.module.ts` contient bien la logique PostgreSQL
3. Vérifier que les dépendances `pg` et `@types/pg` sont installées

### Solution 4 : Fallback temporaire vers SQLite

Si PostgreSQL pose problème, vous pouvez temporairement désactiver PostgreSQL en supprimant la variable `PGHOST` sur Railway. L'application utilisera alors SQLite (mais les données seront perdues à chaque déploiement).

---

## 📞 Informations à Fournir en Cas de Problème

Si le problème persiste, fournir :

1. **Logs Railway complets** (les 100 dernières lignes)
2. **Variables PostgreSQL** (masquer le mot de passe) :
   - `PGHOST`: oui/non
   - `PGPORT`: oui/non
   - `PGUSER`: oui/non
   - `PGPASSWORD`: oui/non
   - `PGDATABASE`: oui/non
3. **Statut du service PostgreSQL** : Running / Stopped / Error
4. **Date du dernier déploiement**

---

## ✅ Logs Attendus Après Correction

Une fois corrigé, vous devriez voir dans les logs :

```
📊 Configuration PostgreSQL détectée:
   Host: containers-us-west-xxx.railway.app
   Port: 5432
   Database: railway
   Username: postgres
📊 Utilisation de PostgreSQL
✅ Base de données initialisée
✅ Admin créé: admin@dayang.com
[Nest] LOG [NestFactory] Starting Nest application...
...
🚀 Application is running on: http://localhost:3000/api
📚 Documentation Swagger: http://localhost:3000/api/docs
```

Ensuite, l'API devrait fonctionner ! 🎉
