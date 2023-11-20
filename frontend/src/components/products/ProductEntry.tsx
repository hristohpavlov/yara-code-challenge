import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '../../graphql/mutations';
import { GET_PRODUCTS } from '../../graphql/queries';

function ProductEntry(){
  const [name, setName] = useState('');
  const [size, setSize] = useState(0.0);
  const [hazardous, setHazardous] = useState(false);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }], // Refetch the product list query after adding a new product
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: { name, size, hazardous },
      });
      setName('');
      setSize(0.0);
      setHazardous(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h2>Product Entry</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Size:</label>
        <input type="number" value={size} onChange={(e) => setSize(parseFloat(e.target.value))} required />

        <label>Hazardous:</label>
        <input type="checkbox" checked={hazardous} onChange={() => setHazardous(!hazardous)} />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductEntry;