const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
let content = fs.readFileSync(envPath, 'utf8');

// Replace port 5432 with 6543 in DATABASE_URL
content = content.replace(/(:5432\/postgres)/, ':6543/postgres');

fs.writeFileSync(envPath, content);
console.log('✅ .env updated to port 6543');
