import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_MOVEMENT } from '../../graphql/mutations';
import { GET_MOVEMENTS } from '../../graphql/queries';

interface warehouseProps{
  selectedWarehouseId?: any
}
function WarehouseStockMovement(props: warehouseProps) {
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState(0.0);

  const [addMovement] = useMutation(ADD_MOVEMENT, {
    refetchQueries: [{ query: GET_MOVEMENTS, 
      variables: { warehouseId: props.selectedWarehouseId },
    }], // Refetch the product list query after adding a new product
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMovement({
        variables: { date, type, productId, warehouseId: props.selectedWarehouseId, amount },
      });
      // Refetch movements or update local state
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  };


  return (
        <div>
        <h2>Warehouse Stock Movement</h2>

        <form onSubmit={handleSubmit}>
            <label>Date:</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required />

            <label>Type (import/export):</label>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />

            <label>Product ID:</label>
            <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} required />

            <label>Amount:</label>
            <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required />

            <button type="submit">Add Movement</button>
        </form>
        </div>
  );
};

export default WarehouseStockMovement;