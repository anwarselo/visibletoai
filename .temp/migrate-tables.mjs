import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Step 1: Dropping old majed_* tables...');

// Drop old tables
const dropSQL = `
DROP TABLE IF EXISTS majed_index_events CASCADE;
DROP TABLE IF EXISTS majed_public_pages CASCADE;
DROP TABLE IF EXISTS majed_assets CASCADE;
DROP TABLE IF EXISTS majed_businesses CASCADE;
`;

// Execute via raw SQL
const dropResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  },
  body: JSON.stringify({ query: dropSQL })
}).catch(() => null);

// If RPC doesn't exist, we'll need to run SQL manually in dashboard
if (!dropResponse || dropResponse.status === 404) {
  console.log('⚠️  Cannot execute SQL via API. Please run these commands in Supabase SQL Editor:');
  console.log(dropSQL);
  console.log('\nThen run the schema.sql file content.');
  process.exit(1);
}

console.log('✓ Old tables dropped');

console.log('\nStep 2: Creating new visibletoai_* tables...');

// Read and execute schema.sql
const schemaSQL = fs.readFileSync('supabase/schema.sql', 'utf-8');

const createResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  },
  body: JSON.stringify({ query: schemaSQL })
});

if (createResponse.status === 404) {
  console.log('⚠️  Cannot execute SQL via API. Please run supabase/schema.sql in Supabase SQL Editor.');
  process.exit(1);
}

console.log('✓ New tables created');

console.log('\n✅ Migration complete!');

