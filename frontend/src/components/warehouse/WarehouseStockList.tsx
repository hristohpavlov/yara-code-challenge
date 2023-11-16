import { useQuery } from '@apollo/client';
import { GET_MOVEMENTS, GET_WAREHOUSE_WITH_PRODUCTS } from '../../graphql/queries';
interface warehouseProps{
    selectedWarehouseId?: any
  }

function WarehouseStockList(props: warehouseProps) {
  const { loading: movementsLoading, error: movementsError, data: movementsData } = useQuery(GET_MOVEMENTS, {
    variables: { warehouseId: props.selectedWarehouseId },
  });
  const { loading, error, data: warehouseData } = useQuery(GET_WAREHOUSE_WITH_PRODUCTS);
  if (movementsLoading) return <p>Loading...</p>;
  if (movementsError) return <p>Error: {movementsError?.message}</p>;
console.log(warehouseData.warehouses
    .find((warehouse: any) => warehouse.id === props.selectedWarehouseId).products);
  return (
    <div>
        <h3>Products from Warehouse: {props.selectedWarehouseId}</h3>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Size</th>
                <th>Product Hazardous</th>
              </tr>
            </thead>
            <tbody>
                <div>
                <h3>Products in Warehouse: {props.selectedWarehouseId}</h3>
                    <ul>
                    {warehouseData?.warehouses?.find((warehouse: any) => warehouse.id === props.selectedWarehouseId)
                        .products?.map((product: any) => (
                        <li key={product.id}>
                            {product.name} - Size: {product.size}, Hazardous: {product.hazardous ? 'Yes' : 'No'}
                        </li>
                        ))}
                    </ul>
                </div>
            </tbody>
          </table>
          <h3>Movements for Warehouse: {props.selectedWarehouseId}</h3>
          <table>
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
              {movementsData.movements.map((movement: any) => (
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
          </table>
      </div>
    
  );
};

export default WarehouseStockList;