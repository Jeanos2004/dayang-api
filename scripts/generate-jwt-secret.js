const crypto = require('crypto');

// Générer une clé JWT sécurisée de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Clé JWT_SECRET générée :\n');
console.log(jwtSecret);
console.log('\n📝 Ajoutez cette ligne dans votre fichier .env :');
console.log(`JWT_SECRET=${jwtSecret}\n`);
