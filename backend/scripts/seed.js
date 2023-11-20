const pool = require('../utils/pgcredentials.js');
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
    await pool.query('INSERT INTO warehouses(name, size) VALUES($1, $2)', ['Warehouse C', 125.0]);
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

    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-13', 'import', 2, 2, 1.0]
    );
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-14', 'export', 2, 2, 1.0]
    );
    await pool.query(
      'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5)',
      ['2023-11-14', 'import', 4, 2, 1.0]
    );

    const importMovementsResult = await pool.query('SELECT * FROM movements WHERE type = $1', [
      'import',
    ]);
    const importMovements = importMovementsResult.rows;

    // Loop through each import movement
    for (const movement of importMovements) {
      // Check if the product is hazardous
      const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [
        movement.product_id,
      ]);
      const product = productResult.rows[0];

      // Update the corresponding warehouse based on the hazard status of the product
      await pool.query('UPDATE warehouses SET hazardous = $1 WHERE id = $2', [
        product && product.hazardous, // Set hazardous to true if product is hazardous, false otherwise
        movement.warehouse_id,
      ]);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedData();