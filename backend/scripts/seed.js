const pool = require('./pgcredentials.js');
const seedData = async () => {
  try {
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