const pool = require('./pgcredentials.js');
const createDB = async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE warehouses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        size FLOAT NOT NULL,
        hazardous BOOLEAN
      );
    
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        size FLOAT NOT NULL,
        hazardous BOOLEAN NOT NULL,
        warehouse_id INT REFERENCES warehouses(id)
      );

      CREATE TABLE movements (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        type VARCHAR(50) NOT NULL,
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        warehouse_id INT REFERENCES warehouses(id) ON DELETE CASCADE,
        amount FLOAT NOT NULL
      );
    `);
    console.log('Creating DB completed successfully!');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
};

// Run the create function
createDB();