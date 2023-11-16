const pool = require('./pgcredentials.js');

const wipeTables = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS movements, products, warehouses CASCADE');
    console.log('Wiping of database tables completed successfully!');
  } catch (error) {
    console.error('Error wiping database tables:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
};

// Run the wipe tables function
wipeTables();