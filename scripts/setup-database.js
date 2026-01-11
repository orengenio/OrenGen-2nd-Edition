#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up OrenGen CRM database...\n');

  // Read database URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('Please set it in your .env.local file');
    console.error('Example: DATABASE_URL="postgresql://user:password@localhost:5432/orengen_crm"');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read schema file
    const schemaPath = path.join(__dirname, '../crm/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n📝 Executing schema...');

    // Execute schema
    await client.query(schema);

    console.log('✅ Database schema created successfully');

    // Create a default super admin user (for testing)
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('admin123', 12);

    try {
      await client.query(
        `INSERT INTO users (email, name, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        ['admin@orengen.io', 'Admin User', defaultPassword, 'super_admin']
      );

      console.log('\n✅ Default admin user created:');
      console.log('   Email: admin@orengen.io');
      console.log('   Password: admin123');
      console.log('   ⚠️  IMPORTANT: Change this password immediately in production!');
    } catch (error) {
      console.log('\nℹ️  Admin user already exists');
    }

    console.log('\n✨ Database setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Login with admin@orengen.io / admin123');
    console.log('4. Change the admin password\n');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
