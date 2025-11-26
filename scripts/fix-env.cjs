const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
let content = fs.readFileSync(envPath, 'utf8');

const newUrl = 'postgresql://postgres.nfmzyetntmkjxmzbmtvo:Adroit93$$$@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

// Replace the whole DATABASE_URL line
// Regex looks for DATABASE_URL=... until end of line
content = content.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${newUrl}"`);

fs.writeFileSync(envPath, content);
console.log('✅ .env updated successfully');
