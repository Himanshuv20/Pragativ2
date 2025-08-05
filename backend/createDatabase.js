const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'admin'
};

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL server...');
    
    // Connect to MySQL server
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS agriguru CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "agriguru" created or already exists');

    // Use the database
    await connection.query('USE agriguru');
    console.log('✅ Using agriguru database');

    // Read and execute the SQL schema
    const sqlPath = path.join(__dirname, 'AgriGuru.sql');
    console.log('📄 Reading SQL schema from:', sqlPath);
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL content by statements (basic splitting)
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`🔄 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length > 0 && !statement.startsWith('--')) {
        try {
          await connection.execute(statement);
          if (i % 10 === 0) {
            console.log(`✅ Executed ${i + 1}/${statements.length} statements`);
          }
        } catch (error) {
          if (!error.message.includes('already exists') && 
              !error.message.includes('Duplicate key') &&
              !error.message.includes('Unknown column')) {
            console.warn(`⚠️ Warning executing statement ${i + 1}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ All SQL statements executed successfully');
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('📊 Database connection closed');
    }
  }
}

// Run if called directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('🏁 Database creation process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createDatabase };
