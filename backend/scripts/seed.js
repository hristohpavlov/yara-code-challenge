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
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 3',
      18.0,
      false,
    ]);
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 4',
      26.7,
      true,
    ]);
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 5',
      88.9,
      false,
    ]);
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 6',
      9.3,
      true,
    ]);
    await pool.query('INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3)', [
      'Product 7',
      63.5,
      false,
    ]);

    // Seed Warehouses
    await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse A', 200.0]);
    await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse B', 150.0]);
    // await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse C', 125.0]);
    // await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse D', 75.0]);
    // await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse E', 100.0]);
    // await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse F', 95.0]);

    // Seed Movements
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-13', 'import', 1, 1, 5.0]
    );
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-14', 'export', 1, 1, 3.0]
    );

    //Update warehouse id
    await pool.query(`
      UPDATE products
      SET warehouse_id = CASE
        WHEN hazardous THEN 1
        ELSE 2
      END;
    `);

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