import { useQuery } from '@apollo/client';
import {  GET_MOVEMENTS } from '../../graphql/queries';
import { Movement } from '../../graphql/types';
import { Table, Container } from 'react-bootstrap';
interface warehouseProps{
    selectedWarehouseId?: string
  }

function WarehouseStockList(props: warehouseProps) {
  const { loading: movementsLoading, error: movementsError, data: movementsData } = useQuery(GET_MOVEMENTS, {
    variables: { warehouseId: props.selectedWarehouseId },
  });
  
  
  if (movementsLoading) return <p>Loading...</p>;
  if (movementsError) return <p>Error: {movementsError?.message}</p>;
  return (
    <Container>
      <h3>Movements for Warehouse: {props.selectedWarehouseId}</h3>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Product Size</th>
            <th>Product Hazardous</th>
            <th>Warehouse ID</th>
            <th>Warehouse Name</th>
            <th>Warehouse Size</th>
          </tr>
        </thead>
        <tbody>
          {movementsData.movements.map((movement: Movement) => (
            <tr key={movement.id}>
              <td>{movement.id}</td>
              <td>{movement.date}</td>
              <td>{movement.type}</td>
              <td>{movement.amount}</td>
              <td>{movement.product.id}</td>
              <td>{movement.product.name}</td>
              <td>{movement.product.size}</td>
              <td>{movement.product.hazardous ? 'Yes' : 'No'}</td>
              <td>{movement.warehouse.id}</td>
              <td>{movement.warehouse.name}</td>
              <td>{movement.warehouse.size}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default WarehouseStockList;