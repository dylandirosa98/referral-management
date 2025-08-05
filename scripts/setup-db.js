#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Setting up database...');

try {
  // Push database schema
  console.log('📦 Pushing database schema...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  console.log('✅ Database setup complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}