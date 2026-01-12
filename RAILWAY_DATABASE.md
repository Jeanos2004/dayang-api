# 🗄️ Persistance de la Base de Données sur Railway

## ⚠️ Problème : SQLite est Éphémère

Sur Railway, **SQLite est perdu à chaque redéploiement** car le système de fichiers est éphémère. Cela signifie :
- ❌ Toutes les données sont perdues à chaque déploiement
- ✅ Les tables sont recréées automatiquement
- ✅ L'admin par défaut est recréé automatiquement

## ✅ Solutions Recommandées

### Option 1 : PostgreSQL (Gratuit sur Railway - Recommandé)

PostgreSQL est **persistant** et **gratuit** sur Railway.

#### Étape 1 : Créer PostgreSQL sur Railway

1. Dans votre projet Railway
2. Cliquer sur **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway crée automatiquement les variables d'environnement :
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

#### Étape 2 : Modifier `app.module.ts`

Remplacer la configuration TypeORM SQLite par PostgreSQL :

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PGHOST'),
    port: configService.get('PGPORT', 5432),
    username: configService.get('PGUSER'),
    password: configService.get('PGPASSWORD'),
    database: configService.get('PGDATABASE'),
    entities: [Admin, Post, Page, Message, Setting],
    synchronize: true,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour Railway PostgreSQL
    },
  }),
  inject: [ConfigService],
}),
```

#### Étape 3 : Mettre à jour `package.json`

Vérifier que `pg` est installé :
```bash
npm install pg
npm install --save-dev @types/pg
```

#### Étape 4 : Mettre à jour `main.ts`

Modifier la fonction `initializeDatabase` pour PostgreSQL :

```typescript
const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('PGHOST'),
  port: configService.get('PGPORT', 5432),
  username: configService.get('PGUSER'),
  password: configService.get('PGPASSWORD'),
  database: configService.get('PGDATABASE'),
  entities: [Admin, Post, Page, Message, Setting],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
```

#### Avantages PostgreSQL :
- ✅ **Persistant** : Les données survivent aux redéploiements
- ✅ **Gratuit** sur Railway
- ✅ **Plus robuste** pour la production
- ✅ **Support transactions** et relations complexes

---

### Option 2 : Volume Persistant Railway (Payant)

Railway propose des volumes persistants, mais c'est une fonctionnalité **payante**.

---

### Option 3 : Accepter la Perte de Données (Développement uniquement)

Si c'est pour du développement/test :
- ✅ Acceptable si vous n'avez pas besoin de conserver les données
- ✅ Les tables sont recréées automatiquement
- ✅ L'admin est recréé automatiquement
- ❌ Toutes les autres données sont perdues

---

## 🔄 Migration SQLite → PostgreSQL

Si vous avez déjà des données SQLite à migrer :

1. **Exporter les données SQLite** :
   ```bash
   sqlite3 database.sqlite .dump > dump.sql
   ```

2. **Adapter le dump pour PostgreSQL** (supprimer les syntaxes SQLite spécifiques)

3. **Importer dans PostgreSQL** :
   ```bash
   psql -h $PGHOST -U $PGUSER -d $PGDATABASE < dump.sql
   ```

---

## 📝 Recommandation Finale

**Pour la production : Utilisez PostgreSQL** (gratuit sur Railway)
**Pour le développement : SQLite est acceptable** (données perdues à chaque déploiement)
