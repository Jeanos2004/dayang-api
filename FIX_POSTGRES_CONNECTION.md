# 🔧 Résoudre ECONNREFUSED PostgreSQL sur Railway

## ❌ Erreur
```
Error: connect ECONNREFUSED 10.177.27.59:5432
```

## 🔍 Causes

### 1. PostgreSQL non lié au service web
**Problème le plus courant** : PostgreSQL est créé mais pas lié au service web.

**Solution :**
1. Dans Railway, ouvrir votre **service web** (NestJS)
2. Aller dans l'onglet **"Variables"**
3. Chercher la section **"Connected Services"** ou **"Referenced Variables"**
4. Si PostgreSQL n'apparaît pas, il faut le lier :
   - Cliquer sur **"New Variable"** ou **"Add Reference"**
   - Sélectionner le service PostgreSQL
   - Railway créera automatiquement les variables `PGHOST`, `PGUSER`, etc.

### 2. PostgreSQL non démarré

**Solution :**
1. Dans Railway, ouvrir le **service PostgreSQL**
2. Vérifier que le statut est **"Running"** (pas "Stopped" ou "Error")
3. Si ce n'est pas "Running", cliquer sur **"Restart"**

### 3. PostgreSQL dans un autre projet

**Solution :**
1. Vérifier que PostgreSQL est dans le **même projet Railway** que votre service web
2. Si ce n'est pas le cas, soit :
   - Déplacer PostgreSQL dans le même projet
   - Ou créer un nouveau PostgreSQL dans le projet actuel

### 4. Variables PostgreSQL incorrectes

**Vérifier :**
1. Dans votre service web → "Variables"
2. Vérifier que ces 5 variables existent et ont des valeurs :
   - `PGHOST` (doit ressembler à `xxx.railway.app` ou une IP)
   - `PGPORT` (généralement `5432`)
   - `PGUSER` (généralement `postgres`)
   - `PGPASSWORD` (un mot de passe long)
   - `PGDATABASE` (généralement `railway` ou `postgres`)

---

## ✅ Solution Rapide : Re-lier PostgreSQL

### Étape 1 : Supprimer les anciennes variables
1. Dans votre service web → "Variables"
2. Supprimer manuellement ces variables si elles existent :
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### Étape 2 : Lier PostgreSQL correctement
1. Toujours dans "Variables" du service web
2. Cliquer sur **"New Variable"** ou chercher **"Reference Variable"**
3. Sélectionner votre service PostgreSQL
4. Railway créera automatiquement toutes les variables avec les bonnes références

### Étape 3 : Redémarrer
1. Redémarrer le service PostgreSQL
2. Attendre qu'il soit complètement démarré
3. Redémarrer le service web

---

## 🔍 Vérification

Après correction, les logs devraient montrer :
```
📊 Configuration PostgreSQL détectée:
   Host: containers-us-west-xxx.railway.app
   Port: 5432
   Database: railway
   Username: postgres
```

Et **PAS** d'erreurs `ECONNREFUSED`.

---

## 🆘 Si ça ne fonctionne toujours pas

1. **Créer un nouveau service PostgreSQL** :
   - Supprimer l'ancien
   - "New" → "Database" → "Add PostgreSQL"
   - Lier au service web

2. **Vérifier les logs PostgreSQL** :
   - Ouvrir le service PostgreSQL
   - Voir les logs pour vérifier qu'il démarre correctement

3. **Fallback temporaire vers SQLite** :
   - Supprimer temporairement la variable `PGHOST`
   - L'application utilisera SQLite (mais données perdues à chaque déploiement)
