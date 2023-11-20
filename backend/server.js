const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const typeDefs = require('./utils/typeDefs.js');
const resolvers = require('./utils/resolvers.js');
const app = express();
app.use(bodyParser.json());
app.use(cors());
let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();
const PORT = 3001;

app.post('/calculate', (req, res) => {
  try {
    const { movements, warehouseSize } = req.body;

    if (!movements || movements.length === 0) {
      // Empty array of movements, return original warehouse size
      res.json({ currentStockLevel: 0, remainingStockSpace: warehouseSize });
      return;
    }

    const stockDetails = movements.reduce(
      (acc, movement) => {
        const productSize = movement.product ? movement.product.size : 0;
        const productAmount = movement.amount || 0;

        if (movement.type === 'import') {
          // For import movements, check if there is enough space in the warehouse
          const importSpaceRequired = productSize * productAmount;
          if (acc.remainingStockSpace >= importSpaceRequired) {
            // Enough space, proceed to add the import movement
            acc.currentStockLevel += importSpaceRequired;
          } else {
            // Not enough space, handle the error as needed
            throw new Error('Not enough space in the warehouse for import');
          }
        } else if (movement.type === 'export') {
          // For export movements, check if there is enough stock to export
          const exportAmount = productSize * productAmount;
          if (acc.currentStockLevel >= exportAmount) {
            acc.currentStockLevel -= exportAmount;
          } else {
            // Not enough stock to export, handle the error as needed
            throw new Error('Not enough stock to export');
          }
        }

        acc.remainingStockSpace = warehouseSize - acc.currentStockLevel;
        return acc;
      },
      { currentStockLevel: 0, remainingStockSpace: warehouseSize }
    );

    res.json(stockDetails);
  } catch (error) {
    console.error('Error calculating stock:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});