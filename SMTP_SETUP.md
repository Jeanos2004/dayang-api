# 📧 Configuration SMTP pour l'envoi d'emails

Ce guide explique comment configurer l'envoi d'emails pour la réinitialisation de mot de passe.

## 🔐 Gmail (Recommandé pour les tests)

### Étape 1 : Activer la validation en deux étapes (2FA)

1. Allez sur [Mon compte Google](https://myaccount.google.com/)
2. Dans le menu de gauche, cliquez sur **"Sécurité"**
3. Dans la section **"Connexion à Google"**, trouvez **"Validation en deux étapes"**
4. Si elle n'est pas activée, cliquez sur **"Commencer"** et suivez les instructions
5. Vous devrez confirmer avec votre téléphone

### Étape 2 : Générer un mot de passe d'application

1. Une fois la validation en deux étapes activée, retournez à la page **"Sécurité"**
2. Dans la section **"Validation en deux étapes"**, cliquez sur **"Mots de passe des applications"**
   - Si vous ne voyez pas cette option, cherchez "Mots de passe des applications" dans la barre de recherche de Google
3. Sélectionnez **"Application"** → **"Autre (nom personnalisé)"**
4. Entrez un nom (ex: "Dayang Backend" ou "API Email")
5. Cliquez sur **"Générer"**
6. **IMPORTANT** : Copiez immédiatement le mot de passe affiché (16 caractères, sans espaces)
   - Exemple : `abcd efgh ijkl mnop` → Utilisez `abcdefghijklmnop`

### Étape 3 : Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=votre-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

**Remplacez :**
- `votre-email@gmail.com` par votre adresse Gmail
- `abcdefghijklmnop` par le mot de passe d'application généré (16 caractères, sans espaces)

### ⚠️ Important

- **Ne partagez JAMAIS** votre mot de passe d'application
- Utilisez **uniquement** le mot de passe d'application (pas votre mot de passe Gmail normal)
- Si vous perdez le mot de passe, vous devrez en générer un nouveau

---

## 🔵 Autres services email

### Outlook / Hotmail

1. Allez sur [Microsoft Account Security](https://account.microsoft.com/security)
2. Activez la validation en deux facteurs
3. Allez sur **"Mots de passe d'application"**
4. Générer un nouveau mot de passe d'application
5. Configuration :
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@outlook.com
SMTP_PASSWORD=mot-de-passe-application
```

### SendGrid (Recommandé pour production)

1. Créer un compte sur [SendGrid](https://sendgrid.com/) (gratuit jusqu'à 100 emails/jour)
2. Créer une **API Key** dans Settings → API Keys
3. Configuration :
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=votre-api-key-sendgrid
SMTP_FROM=noreply@votredomaine.com
```

### Mailgun (Alternative pour production)

1. Créer un compte sur [Mailgun](https://www.mailgun.com/) (gratuit jusqu'à 5000 emails/mois)
2. Récupérer les credentials SMTP dans le dashboard
3. Configuration :
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASSWORD=votre-mot-de-passe-mailgun
```

---

## ✅ Tester la configuration

1. Démarrer l'application :
```bash
npm run start:dev
```

2. Tester l'envoi d'email via Swagger :
   - Aller sur `http://localhost:3000/api/docs`
   - Tester `POST /api/auth/forgot-password`
   - Entrer l'email d'un admin existant
   - Vérifier la boîte mail (et les spams)

3. Vérifier les logs :
   - Si la configuration est correcte, vous verrez : `✅ Email de réinitialisation envoyé à ...`
   - Si il y a une erreur, vous verrez : `❌ Erreur lors de l'envoi de l'email`

---

## 🐛 Dépannage

### Erreur : "Invalid login"
- Vérifiez que vous utilisez le **mot de passe d'application** (pas votre mot de passe Gmail)
- Vérifiez que la validation en deux étapes est activée
- Vérifiez que le mot de passe est copié sans espaces

### Erreur : "Connection timeout"
- Vérifiez votre connexion internet
- Vérifiez que le port 587 n'est pas bloqué par un firewall
- Essayez avec `SMTP_PORT=465` et `SMTP_SECURE=true`

### Email non reçu
- Vérifiez le dossier spam/courrier indésirable
- Vérifiez que l'adresse email est correcte
- Vérifiez les logs de l'application pour voir les erreurs

---

## 📝 Notes

- Pour le **développement local**, Gmail avec un mot de passe d'application fonctionne très bien
- Pour la **production**, il est recommandé d'utiliser un service dédié comme SendGrid ou Mailgun
- Le service d'email fonctionne en **mode fallback** si SMTP n'est pas configuré (les emails ne seront pas envoyés, mais l'application fonctionne)
