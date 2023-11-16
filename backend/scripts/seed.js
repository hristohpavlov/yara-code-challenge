const { Pool } = require('pg');
//establish connection to postgre
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
});

const seedData = async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        size FLOAT NOT NULL,
        hazardous BOOLEAN NOT NULL
      );

      CREATE TABLE warehouses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        size FLOAT NOT NULL
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
    // Seed Products
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 1',
      10.5,
      false,
    ]);
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 2',
      8.0,
      true,
    ]);

    // Seed Warehouses
    await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse A', 20.0]);
    await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse B', 15.0]);

    // Seed Movements
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-13', 'import', 1, 1, 5.0]
    );
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-14', 'export', 1, 1, 3.0]
    );

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
};

// Run the seeding function
seedData();