const pool = require('./pgcredentials.js');

const resolvers = {
    Query: {
      products: async () => {
        const { rows } = await pool.query('SELECT * FROM products');
        return rows;
      },
      warehouses: async () => {
        const { rows } = await pool.query('SELECT * FROM warehouses');
        return rows;
      },
      movements: async (_, { type, warehouseId }) => {
        try {
          let query = 'SELECT * FROM movements WHERE warehouse_id = $1';
  
          // If type is provided, add it to the query
          if (type) {
            query += ' AND type = $2';
          }
  
          const { rows } = await pool.query(query, type ? [warehouseId, type] : [warehouseId]);
  
          return rows;
        } catch (error) {
          console.error('Error fetching movements:', error);
          throw new Error('Failed to fetch movements');
        }
      },
    },
    Mutation: {
      addProduct: async (_, { name, size, hazardous }) => {
        const { rows } = await pool.query(
          'INSERT INTO products(name, size, hazardous) VALUES($1, $2, $3) RETURNING *',
          [name, size, hazardous]
        );
        return rows[0];
      },
      addMovement: async (_, { date, type, productId, warehouseId, amount }) => {
        try {
          // Add the new movement to the database
          const { rows } = await pool.query(
            'INSERT INTO movements(date, type, product_id, warehouse_id, amount) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [date, type, productId, warehouseId, amount]
          );
  
          // Fetch the number of import movements for the warehouse
          const importMovementsCountResult = await pool.query(
            'SELECT COUNT(*) FROM movements WHERE type = $1 AND warehouse_id = $2',
            ['import', warehouseId]
          );
          const importMovementsCount = parseInt(importMovementsCountResult.rows[0].count);
  
          // If it's the first import movement for the warehouse, update the hazardous property
          if (importMovementsCount === 1) {
            const productResult = await pool.query('SELECT hazardous FROM products WHERE id = $1', [productId]);
            const isProductHazardous = productResult.rows[0]?.hazardous || false;
  
            await pool.query('UPDATE warehouses SET hazardous = $1 WHERE id = $2', [
              isProductHazardous, // Set hazardous to true if product is hazardous, false otherwise
              warehouseId,
            ]);
          }
  
          return rows[0];
        } catch (error) {
          console.error('Error adding movement:', error);
          throw new Error('Failed to add movement');
        }
      },
    },
    Movement: {
      product: async (parent, args, context, info) => {
        try {
          const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [parent.product_id]);
          return rows[0];
        } catch (error) {
          console.error('Error fetching product:', error);
          throw new Error('Unable to fetch product');
        }
      },
      warehouse: async (parent, args, context, info) => {
        try {
          const { rows } = await pool.query('SELECT * FROM warehouses WHERE id = $1', [parent.warehouse_id]);
          return rows[0];
        } catch (error) {
          console.error('Error fetching warehouse:', error);
          throw new Error('Unable to fetch warehouse');
        }
      },
    },
    Warehouse: {
      products: async (parent, args, context, info) => {
        try {
          const products = await fetchProductsByWarehouseId(parent.id);
          return products || [];
        } catch (error) {
          console.error('Error fetching products for warehouse:', error);
          throw new Error('Unable to fetch products for warehouse');
        }
      },
    },
  };

  async function fetchProductsByWarehouseId(warehouseId) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM products WHERE warehouse_id = $1',
        [warehouseId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching products by warehouse ID:', error);
      throw new Error('Unable to fetch products by warehouse ID');
    }
  } 

  module.exports = resolvers;